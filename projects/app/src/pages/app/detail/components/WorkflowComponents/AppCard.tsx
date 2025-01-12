import React, { useCallback, useMemo } from 'react';
import { Box, Flex, HStack, useDisclosure } from '@chakra-ui/react';
import { useContextSelector } from 'use-context-selector';
import { AppContext } from '../context';
import { useTranslation } from 'next-i18next';
import Avatar from '@fastgpt/web/components/common/Avatar';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { WorkflowContext } from './context';
import { filterSensitiveNodesData } from '@/web/core/workflow/utils';
import dynamic from 'next/dynamic';
import { useCopyData } from '@/web/common/hooks/useCopyData';
import MyTag from '@fastgpt/web/components/common/Tag/index';
import { publishStatusStyle } from '../constants';
import MyPopover from '@fastgpt/web/components/common/MyPopover';
import { fileDownload } from '@/web/common/file/utils';
import { AppChatConfigType, AppSimpleEditFormType } from '@fastgpt/global/core/app/type';
import MyBox from '@fastgpt/web/components/common/MyBox';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { filterSensitiveFormData } from '@/web/core/app/utils';

const ImportSettings = dynamic(() => import('./Flow/ImportSettings'));

const AppCard = ({ showSaveStatus, isSaved }: { showSaveStatus: boolean; isSaved: boolean }) => {
  const { t } = useTranslation();
  const { feConfigs } = useSystemStore();

  const { appDetail, onOpenInfoEdit, onOpenTeamTagModal, onDelApp } = useContextSelector(
    AppContext,
    (v) => v
  );

  const { isOpen: isOpenImport, onOpen: onOpenImport, onClose: onCloseImport } = useDisclosure();

  const InfoMenu = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return (
        <MyPopover
          placement={'bottom-end'}
          hasArrow={false}
          offset={[2, 4]}
          w={'116px'}
          trigger={'hover'}
          Trigger={children}
        >
          {({ onClose }) => (
            <Box p={1.5}>
              <MyBox
                display={'flex'}
                size={'md'}
                px={1}
                py={1.5}
                rounded={'4px'}
                _hover={{ color: 'primary.600', bg: 'rgba(17, 24, 36, 0.05)' }}
                cursor={'pointer'}
                onClick={onOpenInfoEdit}
              >
                <MyIcon name={'edit'} w={'16px'} mr={2} />
                <Box fontSize={'sm'}>{t('app:edit_info')}</Box>
              </MyBox>
              <MyBox
                display={'flex'}
                size={'md'}
                px={1}
                py={1.5}
                rounded={'4px'}
                _hover={{ color: 'primary.600', bg: 'rgba(17, 24, 36, 0.05)' }}
                cursor={'pointer'}
                onClick={onOpenInfoEdit}
              >
                <MyIcon name={'key'} w={'16px'} mr={2} />
                <Box fontSize={'sm'}>{t('app:Role_setting')}</Box>
              </MyBox>
              <Box w={'full'} h={'1px'} bg={'myGray.200'} my={1} />
              <MyBox
                display={'flex'}
                size={'md'}
                px={1}
                py={1.5}
                rounded={'4px'}
                _hover={{ color: 'primary.600', bg: 'rgba(17, 24, 36, 0.05)' }}
                cursor={'pointer'}
                onClick={onOpenImport}
              >
                <MyIcon name={'common/importLight'} w={'16px'} mr={2} />
                <Box fontSize={'sm'}>{t('app:import_configs')}</Box>
              </MyBox>
              <MyBox
                display={'flex'}
                size={'md'}
                px={1}
                py={1.5}
                rounded={'4px'}
                _hover={{ color: 'primary.600', bg: 'rgba(17, 24, 36, 0.05)' }}
                cursor={'pointer'}
              >
                {ExportPopover({
                  chatConfig: appDetail.chatConfig,
                  appName: appDetail.name
                })}
              </MyBox>
              {appDetail.permission.hasWritePer && feConfigs?.show_team_chat && (
                <>
                  <Box w={'full'} h={'1px'} bg={'myGray.200'} my={1} />

                  <MyBox
                    display={'flex'}
                    size={'md'}
                    px={1}
                    py={1.5}
                    rounded={'4px'}
                    _hover={{ color: 'primary.600', bg: 'rgba(17, 24, 36, 0.05)' }}
                    cursor={'pointer'}
                    onClick={onOpenTeamTagModal}
                  >
                    <MyIcon name={'core/dataset/tag'} w={'16px'} mr={2} />
                    <Box fontSize={'sm'}>{t('app:Team_Tags')}</Box>
                  </MyBox>
                </>
              )}

              {appDetail.permission.isOwner && (
                <>
                  <Box w={'full'} h={'1px'} bg={'myGray.200'} my={1} />

                  <MyBox
                    display={'flex'}
                    size={'md'}
                    px={1}
                    py={1.5}
                    rounded={'4px'}
                    color={'red.600'}
                    _hover={{ bg: 'rgba(17, 24, 36, 0.05)' }}
                    cursor={'pointer'}
                    onClick={onDelApp}
                  >
                    <MyIcon name={'delete'} w={'16px'} mr={2} />
                    <Box fontSize={'sm'}>{t('common:common.Delete')}</Box>
                  </MyBox>
                </>
              )}
            </Box>
          )}
        </MyPopover>
      );
    },
    [
      appDetail.chatConfig,
      appDetail.name,
      appDetail.permission.hasWritePer,
      appDetail.permission.isOwner,
      feConfigs?.show_team_chat,
      onDelApp,
      onOpenImport,
      onOpenInfoEdit,
      onOpenTeamTagModal,
      t
    ]
  );

  const Render = useMemo(() => {
    return (
      <HStack>
        <Avatar src={appDetail.avatar} w={'1.75rem'} borderRadius={'md'} />
        <Box>
          <InfoMenu>
            <HStack
              spacing={1}
              cursor={'pointer'}
              pl={1}
              ml={-1}
              borderRadius={'xs'}
              _hover={{ bg: 'myGray.150' }}
            >
              <Box color={'myGray.900'}>{appDetail.name}</Box>
              <MyIcon name={'common/select'} w={'1rem'} color={'myGray.500'} />
            </HStack>
          </InfoMenu>
          {showSaveStatus && (
            <Flex alignItems={'center'} fontSize={'mini'} lineHeight={1}>
              <MyTag
                py={0}
                px={1}
                showDot
                bg={'transparent'}
                colorSchema={
                  isSaved
                    ? publishStatusStyle.published.colorSchema
                    : publishStatusStyle.unPublish.colorSchema
                }
              >
                {t(isSaved ? publishStatusStyle.published.text : publishStatusStyle.unPublish.text)}
              </MyTag>
            </Flex>
          )}
        </Box>

        {isOpenImport && <ImportSettings onClose={onCloseImport} />}
      </HStack>
    );
  }, [
    InfoMenu,
    appDetail.avatar,
    appDetail.name,
    isOpenImport,
    isSaved,
    onCloseImport,
    showSaveStatus,
    t
  ]);

  return Render;
};

export function ExportPopover({
  chatConfig,
  appForm,
  appName
}: {
  chatConfig?: AppChatConfigType;
  appForm?: AppSimpleEditFormType;
  appName: string;
}) {
  const { t } = useTranslation();
  const { copyData } = useCopyData();
  const flowData2StoreData = useContextSelector(WorkflowContext, (v) => v.flowData2StoreData);

  const onExportWorkflow = useCallback(
    async (mode: 'copy' | 'json') => {
      let config = '';

      try {
        if (appForm) {
          config = JSON.stringify(filterSensitiveFormData(appForm), null, 2);
        } else {
          const data = flowData2StoreData();
          if (data) {
            config = JSON.stringify(
              {
                nodes: filterSensitiveNodesData(data.nodes),
                edges: data.edges,
                chatConfig
              },
              null,
              2
            );
          }
        }
      } catch (err) {
        console.error(err);
      }

      if (!config) {
        return;
      }

      if (mode === 'copy') {
        copyData(config, t('app:export_config_successful'));
      } else if (mode === 'json') {
        fileDownload({
          text: config,
          type: 'application/json;charset=utf-8',
          filename: `${appName}.json`
        });
      }
    },
    [appForm, appName, chatConfig, copyData, flowData2StoreData, t]
  );

  return (
    <MyPopover
      placement={'right-start'}
      offset={[0, 20]}
      hasArrow
      trigger={'hover'}
      w={'8.6rem'}
      Trigger={
        <MyBox display={'flex'} cursor={'pointer'}>
          <MyIcon name={'export'} w={'16px'} mr={2} />
          <Box fontSize={'sm'}>{t('app:export_configs')}</Box>
        </MyBox>
      }
    >
      {({ onClose }) => (
        <Box p={1}>
          <Flex
            py={'0.38rem'}
            px={1}
            color={'myGray.600'}
            _hover={{
              bg: 'myGray.05',
              color: 'primary.600',
              cursor: 'pointer'
            }}
            borderRadius={'xs'}
            onClick={() => onExportWorkflow('copy')}
          >
            <MyIcon name={'copy'} w={'1rem'} mr={2} />
            <Box fontSize={'mini'}>{t('common:common.copy_to_clipboard')}</Box>
          </Flex>
          <Flex
            py={'0.38rem'}
            px={1}
            color={'myGray.600'}
            _hover={{
              bg: 'myGray.05',
              color: 'primary.600',
              cursor: 'pointer'
            }}
            borderRadius={'xs'}
            onClick={() => onExportWorkflow('json')}
          >
            <MyIcon name={'configmap'} w={'1rem'} mr={2} />
            <Box fontSize={'mini'}>{t('common:common.export_to_json')}</Box>
          </Flex>
        </Box>
      )}
    </MyPopover>
  );
}

export default AppCard;
