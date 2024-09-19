import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { createContext } from 'use-context-selector';
import { PluginRunBoxProps } from './type';
import { AIChatItemValueItemType, ChatSiteItemType } from '@fastgpt/global/core/chat/type';
import { FieldArrayWithId, FieldValues, useForm } from 'react-hook-form';
import { PluginRunBoxTabEnum } from './constants';
import { useRequest2 } from '@fastgpt/web/hooks/useRequest';
import { useToast } from '@fastgpt/web/hooks/useToast';
import { getNanoid } from '@fastgpt/global/common/string/tools';
import { ChatItemValueTypeEnum, ChatRoleEnum } from '@fastgpt/global/core/chat/constants';
import { generatingMessageProps } from '../type';
import { SseResponseEventEnum } from '@fastgpt/global/core/workflow/runtime/constants';
import { getPluginRunContent } from '@fastgpt/global/core/app/plugin/utils';
import { useTranslation } from 'next-i18next';
import { OutLinkChatAuthProps } from '@fastgpt/global/support/permission/chat';
import { ChatBoxInputFormType, UserInputFileItemType } from '../ChatBox/type';
import { chats2GPTMessages } from '@fastgpt/global/core/chat/adapt';
type PluginRunContextType = OutLinkChatAuthProps &
  PluginRunBoxProps & {
    isChatting: boolean;
    onSubmit: (
      e: FieldValues,
      files?: FieldArrayWithId<ChatBoxInputFormType, 'files', 'id'>[]
    ) => Promise<any>;
    outLinkAuthData: OutLinkChatAuthProps;
  };

export const PluginRunContext = createContext<PluginRunContextType>({
  pluginInputs: [],
  //@ts-ignore
  variablesForm: undefined,
  histories: [],
  setHistories: function (value: React.SetStateAction<ChatSiteItemType[]>): void {
    throw new Error('Function not implemented.');
  },
  appId: '',
  tab: PluginRunBoxTabEnum.input,
  setTab: function (value: React.SetStateAction<PluginRunBoxTabEnum>): void {
    throw new Error('Function not implemented.');
  },
  isChatting: false,
  onSubmit: function (e: FieldValues): Promise<any> {
    throw new Error('Function not implemented.');
  },
  outLinkAuthData: {}
});

const PluginRunContextProvider = ({
  shareId,
  outLinkUid,
  teamId,
  teamToken,
  children,
  ...props
}: PluginRunBoxProps & { children: ReactNode }) => {
  const { pluginInputs, onStartChat, setHistories, histories, setTab } = props;

  const { toast } = useToast();
  const chatController = useRef(new AbortController());
  const { t } = useTranslation();
  /* Abort chat completions, questionGuide */
  const abortRequest = useCallback(() => {
    chatController.current?.abort('stop');
  }, []);

  const outLinkAuthData = useMemo(
    () => ({
      shareId,
      outLinkUid,
      teamId,
      teamToken
    }),
    [shareId, outLinkUid, teamId, teamToken]
  );

  const variablesForm = useForm<ChatBoxInputFormType>({
    defaultValues: {
      files: []
    }
  });

  const generatingMessage = useCallback(
    ({ event, text = '', status, name, tool }: generatingMessageProps) => {
      setHistories((state) =>
        state.map((item, index) => {
          if (index !== state.length - 1 || item.obj !== ChatRoleEnum.AI) return item;

          const lastValue: AIChatItemValueItemType = JSON.parse(
            JSON.stringify(item.value[item.value.length - 1])
          );

          if (event === SseResponseEventEnum.flowNodeStatus && status) {
            return {
              ...item,
              status,
              moduleName: name
            };
          } else if (
            (event === SseResponseEventEnum.answer || event === SseResponseEventEnum.fastAnswer) &&
            text
          ) {
            if (!lastValue || !lastValue.text) {
              const newValue: AIChatItemValueItemType = {
                type: ChatItemValueTypeEnum.text,
                text: {
                  content: text
                }
              };
              return {
                ...item,
                value: item.value.concat(newValue)
              };
            } else {
              lastValue.text.content += text;
              return {
                ...item,
                value: item.value.slice(0, -1).concat(lastValue)
              };
            }
          } else if (event === SseResponseEventEnum.toolCall && tool) {
            const val: AIChatItemValueItemType = {
              type: ChatItemValueTypeEnum.tool,
              tools: [tool]
            };
            return {
              ...item,
              value: item.value.concat(val)
            };
          } else if (
            event === SseResponseEventEnum.toolParams &&
            tool &&
            lastValue.type === ChatItemValueTypeEnum.tool &&
            lastValue?.tools
          ) {
            lastValue.tools = lastValue.tools.map((item) => {
              if (item.id === tool.id) {
                item.params += tool.params;
              }
              return item;
            });
            return {
              ...item,
              value: item.value.slice(0, -1).concat(lastValue)
            };
          } else if (event === SseResponseEventEnum.toolResponse && tool) {
            // replace tool response
            return {
              ...item,
              value: item.value.map((val) => {
                if (val.type === ChatItemValueTypeEnum.tool && val.tools) {
                  const tools = val.tools.map((item) =>
                    item.id === tool.id ? { ...item, response: tool.response } : item
                  );
                  return {
                    ...val,
                    tools
                  };
                }
                return val;
              })
            };
          }

          return item;
        })
      );
    },
    [setHistories]
  );

  const isChatting = useMemo(
    () => histories[histories.length - 1] && histories[histories.length - 1]?.status !== 'finish',
    [histories]
  );

  const { runAsync: onSubmit } = useRequest2(
    async (e: FieldValues, files?: UserInputFileItemType[]) => {
      if (!onStartChat) return;
      if (isChatting) {
        toast({
          title: t('chat:is_chatting'),
          status: 'warning'
        });
        return;
      }
      setTab(PluginRunBoxTabEnum.output);

      // reset controller
      abortRequest();
      const abortSignal = new AbortController();
      chatController.current = abortSignal;

      const createNewChatList = ({
        includeFiles = true
      }: {
        includeFiles?: boolean;
      }): ChatSiteItemType[] => [
        {
          dataId: getNanoid(24),
          obj: ChatRoleEnum.Human,
          status: 'finish',
          value: [
            ...(includeFiles && files
              ? files.map((file) => ({
                  type: ChatItemValueTypeEnum.file as any,
                  file: {
                    type: file.type,
                    name: file.name,
                    url: file.url || '',
                    icon: file.icon || ''
                  }
                }))
              : []),
            {
              type: ChatItemValueTypeEnum.text,
              text: {
                content: getPluginRunContent({
                  pluginInputs,
                  variables: e
                })
              }
            }
          ]
        },
        {
          dataId: getNanoid(24),
          obj: ChatRoleEnum.AI,
          value: [
            {
              type: ChatItemValueTypeEnum.text,
              text: {
                content: ''
              }
            }
          ],
          status: 'loading'
        }
      ];

      setHistories(createNewChatList({}));
      const messages = chats2GPTMessages({
        messages: createNewChatList({ includeFiles: false }),
        reserveId: true
      });

      try {
        const { responseData } = await onStartChat({
          messages: messages,
          controller: chatController.current,
          generatingMessage,
          variables: e
        });

        setHistories((state) =>
          state.map((item, index) => {
            if (index !== state.length - 1) return item;
            return {
              ...item,
              status: 'finish',
              responseData
            };
          })
        );
      } catch (err: any) {
        toast({ title: err.message, status: 'error' });
        setHistories((state) =>
          state.map((item, index) => {
            if (index !== state.length - 1) return item;
            return {
              ...item,
              status: 'finish'
            };
          })
        );
      }
    }
  );

  const contextValue: PluginRunContextType = {
    ...props,
    isChatting,
    onSubmit,
    outLinkAuthData,
    variablesForm
  };
  return <PluginRunContext.Provider value={contextValue}>{children}</PluginRunContext.Provider>;
};

export default PluginRunContextProvider;
