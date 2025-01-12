// @ts-nocheck

import { AppItemType } from '@/types/app';
import { AppTypeEnum } from '@fastgpt/global/core/app/constants';
import { AppSchema } from '@fastgpt/global/core/app/type';
import {
  NodeOutputKeyEnum,
  WorkflowIOValueTypeEnum
} from '@fastgpt/global/core/workflow/constants';
import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '@fastgpt/global/core/workflow/node/constant';
import { StoreEdgeItemType } from '@fastgpt/global/core/workflow/type/edge';
import { StoreNodeItemType } from '@fastgpt/global/core/workflow/type/node';
import { i18nT } from '@fastgpt/web/i18n/utils';

export const emptyTemplates: Record<
  AppTypeEnum.simple | AppTypeEnum.plugin | AppTypeEnum.workflow,
  {
    name: string;
    avatar: string;
    nodes: AppSchema['modules'];
    edges: AppSchema['edges'];
    chatConfig: AppSchema['chatConfig'];
  }
> = {
  [AppTypeEnum.simple]: {
    avatar: 'core/workflow/template/aiChat',
    name: i18nT('app:template.simple_robot'),
    nodes: [
      {
        nodeId: 'userGuide',
        name: i18nT('common:core.module.template.system_config'),
        intro: i18nT('common:core.module.template.config_params'),
        avatar: 'core/workflow/template/systemConfig',
        flowNodeType: FlowNodeTypeEnum.systemConfig,
        position: {
          x: 531.2422736065552,
          y: -486.7611729549753
        },
        version: '481',
        inputs: [
          {
            key: 'welcomeText',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            valueType: WorkflowIOValueTypeEnum.string,
            label: 'core.app.Welcome Text',
            value: ''
          },
          {
            key: 'variables',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            valueType: WorkflowIOValueTypeEnum.any,
            label: 'core.app.Chat Variable',
            value: []
          },
          {
            key: 'questionGuide',
            valueType: WorkflowIOValueTypeEnum.object,
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: 'core.app.Question Guide',
            value: {
              open: false
            }
          },
          {
            key: 'tts',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            valueType: WorkflowIOValueTypeEnum.any,
            label: '',
            value: {
              type: 'web'
            }
          },
          {
            key: 'whisper',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            valueType: WorkflowIOValueTypeEnum.any,
            label: '',
            value: {
              open: false,
              autoSend: false,
              autoTTSResponse: false
            }
          },
          {
            key: 'scheduleTrigger',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            valueType: WorkflowIOValueTypeEnum.any,
            label: '',
            value: null
          }
        ],
        outputs: []
      },
      {
        nodeId: '448745',
        name: i18nT('common:core.module.template.work_start'),
        intro: '',
        avatar: 'core/workflow/template/workflowStart',
        flowNodeType: FlowNodeTypeEnum.workflowStart,
        position: {
          x: 558.4082376415505,
          y: 123.72387429194112
        },
        version: '481',
        inputs: [
          {
            key: 'userChatInput',
            renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.textarea],
            valueType: WorkflowIOValueTypeEnum.string,
            label: i18nT('common:core.module.input.label.user question'),
            required: true,
            toolDescription: i18nT('common:core.module.input.label.user question')
          }
        ],
        outputs: [
          {
            id: 'userChatInput',
            key: 'userChatInput',
            label: 'core.module.input.label.user question',
            valueType: WorkflowIOValueTypeEnum.string,
            type: FlowNodeOutputTypeEnum.static
          }
        ]
      },
      {
        nodeId: 'loOvhld2ZTKa',
        name: i18nT('common:core.module.template.ai_chat'),
        intro: i18nT('common:core.module.template.ai_chat_intro'),
        avatar: 'core/workflow/template/aiChat',
        flowNodeType: FlowNodeTypeEnum.chatNode,
        showStatus: true,
        position: {
          x: 1097.7317280958762,
          y: -244.16014496351386
        },
        version: '481',
        inputs: [
          {
            key: 'model',
            renderTypeList: [
              FlowNodeInputTypeEnum.settingLLMModel,
              FlowNodeInputTypeEnum.reference
            ],
            label: 'core.module.input.label.aiModel',
            valueType: WorkflowIOValueTypeEnum.string,
            value: 'gpt-4o-mini'
          },
          {
            key: 'temperature',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: '',
            value: 0,
            valueType: WorkflowIOValueTypeEnum.number,
            min: 0,
            max: 10,
            step: 1
          },
          {
            key: 'maxToken',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: '',
            value: 2000,
            valueType: WorkflowIOValueTypeEnum.number,
            min: 100,
            max: 4000,
            step: 50
          },
          {
            key: 'isResponseAnswerText',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: '',
            value: true,
            valueType: WorkflowIOValueTypeEnum.boolean
          },
          {
            key: 'quoteTemplate',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: '',
            valueType: WorkflowIOValueTypeEnum.string
          },
          {
            key: 'quotePrompt',
            renderTypeList: [FlowNodeInputTypeEnum.hidden],
            label: '',
            valueType: WorkflowIOValueTypeEnum.string
          },
          {
            key: 'systemPrompt',
            renderTypeList: [FlowNodeInputTypeEnum.textarea, FlowNodeInputTypeEnum.reference],
            max: 3000,
            valueType: WorkflowIOValueTypeEnum.string,
            label: 'core.ai.Prompt',
            description: 'core.app.tip.systemPromptTip',
            placeholder: 'core.app.tip.chatNodeSystemPromptTip',
            value: ''
          },
          {
            key: 'history',
            renderTypeList: [FlowNodeInputTypeEnum.numberInput, FlowNodeInputTypeEnum.reference],
            valueType: WorkflowIOValueTypeEnum.chatHistory,
            label: 'core.module.input.label.chat history',
            required: true,
            min: 0,
            max: 30,
            value: 6
          },
          {
            key: 'userChatInput',
            renderTypeList: [FlowNodeInputTypeEnum.reference, FlowNodeInputTypeEnum.textarea],
            valueType: WorkflowIOValueTypeEnum.string,
            label: i18nT('common:core.module.input.label.user question'),
            required: true,
            toolDescription: i18nT('common:core.module.input.label.user question'),
            value: ['448745', 'userChatInput']
          },
          {
            key: 'quoteQA',
            renderTypeList: [FlowNodeInputTypeEnum.settingDatasetQuotePrompt],
            label: '',
            debugLabel: i18nT('common:core.module.Dataset quote.label'),
            description: '',
            valueType: WorkflowIOValueTypeEnum.datasetQuote
          }
        ],
        outputs: [
          {
            id: 'history',
            key: 'history',
            label: 'core.module.output.label.New context',
            description: 'core.module.output.description.New context',
            valueType: WorkflowIOValueTypeEnum.chatHistory,
            type: FlowNodeOutputTypeEnum.static
          },
          {
            id: 'answerText',
            key: 'answerText',
            label: 'core.module.output.label.Ai response content',
            description: 'core.module.output.description.Ai response content',
            valueType: WorkflowIOValueTypeEnum.string,
            type: FlowNodeOutputTypeEnum.static
          }
        ]
      }
    ],
    edges: [
      {
        source: '448745',
        target: 'loOvhld2ZTKa',
        sourceHandle: '448745-source-right',
        targetHandle: 'loOvhld2ZTKa-target-left'
      }
    ]
  },
  [AppTypeEnum.workflow]: {
    avatar: 'core/app/type/workflowFill',
    name: i18nT('common:core.module.template.empty_workflow'),
    nodes: [
      {
        nodeId: 'userGuide',
        name: i18nT('common:core.module.template.system_config'),
        intro: i18nT('common:core.module.template.system_config_info'),
        avatar: 'core/workflow/template/systemConfig',
        flowNodeType: 'userGuide',
        position: {
          x: 262.2732338817093,
          y: -476.00241136598146
        },
        version: '481',
        inputs: [
          {
            key: 'welcomeText',
            renderTypeList: ['hidden'],
            valueType: 'string',
            label: 'core.app.Welcome Text',
            value: ''
          },
          {
            key: 'variables',
            renderTypeList: ['hidden'],
            valueType: 'any',
            label: 'core.app.Chat Variable',
            value: []
          },
          {
            key: 'questionGuide',
            valueType: 'any',
            renderTypeList: ['hidden'],
            label: 'core.app.Question Guide',
            value: {
              open: false
            }
          },
          {
            key: 'tts',
            renderTypeList: ['hidden'],
            valueType: 'any',
            label: '',
            value: {
              type: 'web'
            }
          },
          {
            key: 'whisper',
            renderTypeList: ['hidden'],
            valueType: 'any',
            label: '',
            value: {
              open: false,
              autoSend: false,
              autoTTSResponse: false
            }
          },
          {
            key: 'scheduleTrigger',
            renderTypeList: ['hidden'],
            valueType: 'any',
            label: '',
            value: null
          }
        ],
        outputs: []
      },
      {
        nodeId: '448745',
        name: i18nT('common:core.module.template.work_start'),
        intro: '',
        avatar: 'core/workflow/template/workflowStart',
        flowNodeType: 'workflowStart',
        position: {
          x: 632.368838596004,
          y: -347.7446492944009
        },
        version: '481',
        inputs: [
          {
            key: 'userChatInput',
            renderTypeList: ['reference', 'textarea'],
            valueType: 'string',
            label: i18nT('common:core.module.input.label.user question'),
            required: true,
            toolDescription: i18nT('common:core.module.input.label.user question')
          }
        ],
        outputs: [
          {
            id: 'userChatInput',
            key: 'userChatInput',
            label: 'common:core.module.input.label.user question',
            type: 'static',
            valueType: 'string'
          }
        ]
      }
    ],
    edges: []
  },
  [AppTypeEnum.plugin]: {
    avatar: 'core/app/type/pluginFill',
    name: i18nT('common:core.module.template.empty_plugin'),
    nodes: [
      {
        nodeId: 'pluginInput',
        name: i18nT('workflow:template.plugin_start'),
        avatar: 'core/workflow/template/workflowStart',
        flowNodeType: FlowNodeTypeEnum.pluginInput,
        showStatus: false,
        position: {
          x: 616.4226348688949,
          y: -165.05298493910115
        },
        version: '481',
        inputs: [],
        outputs: []
      },
      {
        nodeId: 'pluginOutput',
        name: i18nT('common:core.module.template.self_output'),
        avatar: '/imgs/workflow/output.png',
        flowNodeType: FlowNodeTypeEnum.pluginOutput,
        showStatus: false,
        position: {
          x: 1607.7142331269126,
          y: -151.8669210746189
        },
        version: '481',
        inputs: [],
        outputs: []
      },
      {
        nodeId: 'pluginConfig',
        name: i18nT('common:core.module.template.system_config'),
        intro: '',
        avatar: 'core/workflow/template/systemConfig',
        flowNodeType: FlowNodeTypeEnum.pluginConfig,
        position: {
          x: 184.66337662472682,
          y: -216.05298493910115
        },
        version: '4811',
        inputs: [],
        outputs: []
      }
    ],
    edges: []
  }
};

export const getCurlPlugin = ({
  params,
  headers,
  body,
  method,
  url
}: {
  params: {
    key: string;
    value: string | undefined;
    type: string;
  }[];
  headers: {
    key: string;
    value: string | undefined;
    type: string;
  }[];
  body: string;
  method: string;
  url: string;
}): {
  nodes: AppSchema['modules'];
  edges: AppSchema['edges'];
  chatConfig: AppSchema['chatConfig'];
} => {
  return {
    nodes: [
      {
        nodeId: 'pluginInput',
        name: 'workflow:template.plugin_start',
        intro: 'workflow:intro_plugin_input',
        avatar: 'core/workflow/template/workflowStart',
        flowNodeType: 'pluginInput',
        showStatus: false,
        position: {
          x: 630.1191328382079,
          y: -125.05298493910118
        },
        version: '481',
        inputs: [],
        outputs: []
      },
      {
        nodeId: 'pluginOutput',
        name: 'common:core.module.template.self_output',
        intro: 'workflow:intro_custom_plugin_output',
        avatar: 'core/workflow/template/pluginOutput',
        flowNodeType: 'pluginOutput',
        showStatus: false,
        position: {
          x: 1776.334576378706,
          y: -179.2671413906911
        },
        version: '481',
        inputs: [
          {
            renderTypeList: ['reference'],
            valueType: 'any',
            canEdit: true,
            key: 'result',
            label: 'result',
            isToolOutput: false,
            description: '',
            required: true,
            value: ['vumlECDQTjeC', 'httpRawResponse']
          },
          {
            renderTypeList: ['reference'],
            valueType: 'object',
            canEdit: true,
            key: 'error',
            label: 'error',
            isToolOutput: false,
            description: '',
            required: true,
            value: ['vumlECDQTjeC', 'error']
          }
        ],
        outputs: []
      },
      {
        nodeId: 'pluginConfig',
        name: 'common:core.module.template.system_config',
        intro: '',
        avatar: 'core/workflow/template/systemConfig',
        flowNodeType: 'pluginConfig',
        position: {
          x: 182.48010602254573,
          y: -190.55298493910115
        },
        version: '4811',
        inputs: [],
        outputs: []
      },
      {
        nodeId: 'vumlECDQTjeC',
        name: 'HTTP 请求',
        intro: '可以发出一个 HTTP 请求，实现更为复杂的操作（联网搜索、数据库查询等）',
        avatar: 'core/workflow/template/httpRequest',
        flowNodeType: 'httpRequest468',
        showStatus: true,
        position: {
          x: 1068.6226695001628,
          y: -435.2671413906911
        },
        version: '481',
        inputs: [
          {
            key: 'system_addInputParam',
            renderTypeList: ['addInputParam'],
            valueType: 'dynamic',
            label: '',
            required: false,
            description: '接收前方节点的输出值作为变量，这些变量可以被 HTTP 请求参数使用。',
            customInputConfig: {
              selectValueTypeList: [
                'string',
                'number',
                'boolean',
                'object',
                'arrayString',
                'arrayNumber',
                'arrayBoolean',
                'arrayObject',
                'arrayAny',
                'any',
                'chatHistory',
                'datasetQuote',
                'dynamic',
                'selectApp',
                'selectDataset'
              ],
              showDescription: false,
              showDefaultValue: true
            },
            valueDesc: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpMethod',
            renderTypeList: ['custom'],
            valueType: 'string',
            label: '',
            value: method,
            required: true,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpTimeout',
            renderTypeList: ['custom'],
            valueType: 'number',
            label: '',
            value: 30,
            min: 5,
            max: 600,
            required: true,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpReqUrl',
            renderTypeList: ['hidden'],
            valueType: 'string',
            label: '',
            description:
              '新的 HTTP 请求地址。如果出现两个"请求地址"，可以删除该模块重新加入，会拉取最新的模块配置。',
            placeholder: 'https://api.ai.com/getInventory',
            required: false,
            value: url,
            valueDesc: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpHeader',
            renderTypeList: ['custom'],
            valueType: 'any',
            value: headers,
            label: '',
            description:
              '自定义请求头，请严格填入 JSON 字符串。\n1. 确保最后一个属性没有逗号\n2. 确保 key 包含双引号\n例如：{"Authorization":"Bearer xxx"}',
            placeholder: 'common:core.module.input.description.Http Request Header',
            required: false,
            valueDesc: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpParams',
            renderTypeList: ['hidden'],
            valueType: 'any',
            description:
              '新的 HTTP 请求地址。如果出现两个“请求地址”，可以删除该模块重新加入，会拉取最新的模块配置。',
            label: '',
            required: false,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpJsonBody',
            renderTypeList: ['hidden'],
            valueType: 'any',
            value: body,
            label: '',
            required: false,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpFormBody',
            renderTypeList: ['hidden'],
            valueType: 'any',
            value: [],
            label: '',
            required: false,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          },
          {
            key: 'system_httpContentType',
            renderTypeList: ['hidden'],
            valueType: 'string',
            value: 'json',
            label: '',
            required: false,
            valueDesc: '',
            description: '',
            debugLabel: '',
            toolDescription: ''
          }
        ],
        outputs: [
          {
            id: 'system_addOutputParam',
            key: 'system_addOutputParam',
            type: 'dynamic',
            valueType: 'dynamic',
            label: '输出字段提取',
            customFieldConfig: {
              selectValueTypeList: [
                'string',
                'number',
                'boolean',
                'object',
                'arrayString',
                'arrayNumber',
                'arrayBoolean',
                'arrayObject',
                'arrayAny',
                'any',
                'chatHistory',
                'datasetQuote',
                'dynamic',
                'selectApp',
                'selectDataset'
              ],
              showDescription: false,
              showDefaultValue: false
            },
            description: '可以通过 JSONPath 语法来提取响应值中的指定字段',
            valueDesc: ''
          },
          {
            id: 'error',
            key: 'error',
            label: '请求错误',
            description: 'HTTP请求错误信息，成功时返回空',
            valueType: 'object',
            type: 'static',
            valueDesc: ''
          },
          {
            id: 'httpRawResponse',
            key: 'httpRawResponse',
            required: true,
            label: '原始响应',
            description: 'HTTP请求的原始响应。只能接受字符串或JSON类型响应数据。',
            valueType: 'any',
            type: 'static',
            valueDesc: ''
          }
        ]
      }
    ],
    edges: [
      {
        source: 'pluginInput',
        target: 'vumlECDQTjeC',
        sourceHandle: 'pluginInput-source-right',
        targetHandle: 'vumlECDQTjeC-target-left'
      },
      {
        source: 'vumlECDQTjeC',
        target: 'pluginOutput',
        sourceHandle: 'vumlECDQTjeC-source-right',
        targetHandle: 'pluginOutput-target-left'
      }
    ],
    chatConfig: {
      questionGuide: {
        open: false,
        model: 'gpt-4o-mini',
        customPrompt:
          "You are an AI assistant tasked with predicting the user's next question based on the conversation history. Your goal is to generate 3 potential questions that will guide the user to continue the conversation. When generating these questions, adhere to the following rules:\n\n1. Use the same language as the user's last question in the conversation history.\n2. Keep each question under 20 characters in length.\n\nAnalyze the conversation history provided to you and use it as context to generate relevant and engaging follow-up questions. Your predictions should be logical extensions of the current topic or related areas that the user might be interested in exploring further.\n\nRemember to maintain consistency in tone and style with the existing conversation while providing diverse options for the user to choose from. Your goal is to keep the conversation flowing naturally and help the user delve deeper into the subject matter or explore related topics."
      },
      ttsConfig: {
        type: 'web'
      },
      whisperConfig: {
        open: false,
        autoSend: false,
        autoTTSResponse: false
      },
      chatInputGuide: {
        open: false,
        textList: [],
        customUrl: ''
      },
      instruction: '',
      autoExecute: {
        open: false,
        defaultPrompt: ''
      },
      variables: [],
      welcomeText: ''
    }
  };
};
