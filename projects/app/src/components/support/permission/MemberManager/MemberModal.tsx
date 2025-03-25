import { useUserStore } from '@/web/support/user/useUserStore';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  HStack,
  ModalBody,
  ModalFooter,
  Tag,
  Text
} from '@chakra-ui/react';
import { DefaultGroupName } from '@fastgpt/global/support/user/team/group/constant';
import MyAvatar from '@fastgpt/web/components/common/Avatar';
import MyIcon from '@fastgpt/web/components/common/Icon';
import SearchInput from '@fastgpt/web/components/common/Input/SearchInput';
import MyModal from '@fastgpt/web/components/common/MyModal';
import { useRequest2 } from '@fastgpt/web/hooks/useRequest';
import { useTranslation } from 'next-i18next';
import { useMemo, useRef, useState } from 'react';
import PermissionSelect from './PermissionSelect';
import PermissionTags from './PermissionTags';
import {
  DEFAULT_ORG_AVATAR,
  DEFAULT_TEAM_AVATAR,
  DEFAULT_USER_AVATAR
} from '@fastgpt/global/common/system/constants';
import Path from '@/components/common/folder/Path';
import { getOrgChildrenPath } from '@fastgpt/global/support/user/team/org/constant';
import { ParentTreePathItemType } from '@fastgpt/global/common/parentFolder/type';
import { OrgListItemType, OrgType } from '@fastgpt/global/support/user/team/org/type';
import { useContextSelector } from 'use-context-selector';
import { CollaboratorContext } from './context';
import { getTeamMembers } from '@/web/support/user/team/api';
import { getGroupList } from '@/web/support/user/team/group/api';
import { getOrgList, getOrgMembers } from '@/web/support/user/team/org/api';
import { useScrollPagination } from '@fastgpt/web/hooks/useScrollPagination';
import MemberItemCard from './MemberItemCard';
import { GetSearchUserGroupOrg } from '@/web/support/user/api';
import useOrg from '@/web/support/user/team/org/hooks/useOrg';

const HoverBoxStyle = {
  bgColor: 'myGray.50',
  cursor: 'pointer'
};

function MemberModal({
  onClose,
  addPermissionOnly: addOnly = false
}: {
  onClose: () => void;
  addPermissionOnly?: boolean;
}) {
  const { t } = useTranslation();
  const { userInfo } = useUserStore();
  const collaboratorList = useContextSelector(CollaboratorContext, (v) => v.collaboratorList);
  const [searchText, setSearchText] = useState<string>('');
  const [filterClass, setFilterClass] = useState<'member' | 'org' | 'group'>();
  const {
    paths,
    onClickOrg,
    members: orgMembers,
    MemberScrollData: OrgMemberScrollData,
    onPathClick,
    refresh,
    updateCurrentOrg,
    orgs
  } = useOrg({ getPermission: false });

  const { data: members, ScrollData: TeamMemberScrollData } = useScrollPagination(getTeamMembers, {
    pageSize: 15
  });

  const { data: groups = [], loading: loadingGroupsAndOrgs } = useRequest2(
    async () => {
      if (!userInfo?.team?.teamId) return [];
      return getGroupList();
    },
    {
      manual: false,
      refreshDeps: [userInfo?.team?.teamId]
    }
  );

  const { data: searchedData } = useRequest2(() => GetSearchUserGroupOrg(searchText), {
    manual: false,
    throttleWait: 500,
    debounceWait: 200,
    refreshDeps: [searchText]
  });

  const [selectedOrgIdList, setSelectedOrgIdList] = useState<string[]>([]);

  const filterOrgs: (OrgListItemType & { count?: number })[] = useMemo(() => {
    if (searchText && searchedData) {
      const orgids = searchedData.orgs.map((item) => item._id);
      return orgs.filter((org) => orgids.includes(String(org._id)));
    }
    return orgs
      .filter((org) => org.path !== '')
      .map((org) => ({
        ...org,
        count: org.total
      }));
  }, [searchText, orgs, searchedData]);

  const [selectedMemberIdList, setSelectedMembers] = useState<string[]>([]);
  const filterMembers = useMemo(() => {
    if (searchText) {
      return searchedData?.members || [];
    }

    return members;
  }, [searchText, members, searchedData?.members]);
  console.log(filterMembers);

  const [selectedGroupIdList, setSelectedGroupIdList] = useState<string[]>([]);
  const filterGroups = useMemo(() => {
    if (searchText) {
      return searchedData?.groups.map((item) => ({
        groupName: item.name,
        _id: item.id,
        ...item
      }));
    }
    if (!searchText && filterClass !== 'group') return [];

    return groups;
  }, [searchText, filterClass, groups, searchedData]);

  const permissionList = useContextSelector(CollaboratorContext, (v) => v.permissionList);
  const getPerLabelList = useContextSelector(CollaboratorContext, (v) => v.getPerLabelList);
  const [selectedPermission, setSelectedPermission] = useState<number | undefined>(
    permissionList?.read?.value
  );
  const perLabel = useMemo(() => {
    if (selectedPermission === undefined) return '';
    return getPerLabelList(selectedPermission!).join('、');
  }, [getPerLabelList, selectedPermission]);

  const onUpdateCollaborators = useContextSelector(
    CollaboratorContext,
    (v) => v.onUpdateCollaborators
  );

  const { runAsync: onConfirm, loading: isUpdating } = useRequest2(
    () =>
      onUpdateCollaborators({
        members: selectedMemberIdList,
        groups: selectedGroupIdList,
        orgs: selectedOrgIdList,
        permission: selectedPermission!
      }),
    {
      successToast: t('common:common.Add Success'),
      onSuccess() {
        onClose();
      }
    }
  );

  const entryList = useRef([
    { label: t('user:team.group.members'), icon: DEFAULT_USER_AVATAR, value: 'member' },
    { label: t('user:team.org.org'), icon: DEFAULT_ORG_AVATAR, value: 'org' },
    { label: t('user:team.group.group'), icon: DEFAULT_TEAM_AVATAR, value: 'group' }
  ]);

  const selectedList = useMemo(() => {
    const selectedOrgs = orgs.filter((org) => selectedOrgIdList.includes(org._id));
    const selectedGroups = groups.filter((group) => selectedGroupIdList.includes(group._id));
    const selectedMembers = members.filter((member) => selectedMemberIdList.includes(member.tmbId));

    return [
      ...selectedOrgs.map((item) => ({
        id: `org-${item._id}`,
        avatar: item.avatar,
        name: item.name,
        onDelete: () => setSelectedOrgIdList(selectedOrgIdList.filter((v) => v !== item._id)),
        orgs: undefined
      })),
      ...selectedGroups.map((item) => ({
        id: `group-${item._id}`,
        avatar: item.avatar,
        name: item.name === DefaultGroupName ? userInfo?.team.teamName : item.name,
        onDelete: () => setSelectedGroupIdList(selectedGroupIdList.filter((v) => v !== item._id)),
        orgs: undefined
      })),
      ...selectedMembers.map((item) => ({
        id: `member-${item.tmbId}`,
        avatar: item.avatar,
        name: item.memberName,
        onDelete: () => setSelectedMembers(selectedMemberIdList.filter((v) => v !== item.tmbId)),
        orgs: item.orgs
      }))
    ];
  }, [
    orgs,
    groups,
    members,
    selectedOrgIdList,
    selectedGroupIdList,
    selectedMemberIdList,
    userInfo?.team.teamName
  ]);

  return (
    <MyModal
      isOpen
      onClose={onClose}
      iconSrc={addOnly ? 'keyPrimary' : 'modal/AddClb'}
      title={addOnly ? t('user:team.add_permission') : t('user:team.add_collaborator')}
      minW="800px"
      maxW={'60vw'}
      h={'100%'}
      maxH={'90vh'}
      isCentered
      isLoading={loadingGroupsAndOrgs}
    >
      <ModalBody flex={'1'}>
        <Grid
          border="1px solid"
          borderColor="myGray.200"
          borderRadius="0.5rem"
          gridTemplateColumns="1fr 1fr"
          h={'100%'}
        >
          <Flex
            h={'100%'}
            flexDirection="column"
            borderRight="1px solid"
            borderColor="myGray.200"
            p="4"
          >
            <SearchInput
              placeholder={t('user:search_group_org_user')}
              bgColor="myGray.50"
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Flex flexDirection="column" mt="3" overflow={'auto'} flex={'1 0 0'} h={0}>
              {/* Entry */}
              {!searchText && !filterClass && (
                <>
                  {entryList.current.map((item) => {
                    return (
                      <HStack
                        key={item.value}
                        justifyContent="space-between"
                        py="2"
                        px="3"
                        borderRadius="sm"
                        alignItems="center"
                        _hover={HoverBoxStyle}
                        _notLast={{ mb: 1 }}
                        onClick={() => setFilterClass(item.value as any)}
                      >
                        <MyAvatar src={item.icon} w="1.5rem" borderRadius={'50%'} />
                        <Box ml="2" w="full">
                          {item.label}
                        </Box>
                        <MyIcon name="core/chat/chevronRight" w="16px" />
                      </HStack>
                    );
                  })}
                </>
              )}

              {/* Path */}
              {!searchText && filterClass && (
                <Box mb={1}>
                  <Path
                    paths={[
                      {
                        parentId: filterClass,
                        parentName:
                          filterClass === 'member'
                            ? t('user:team.group.members')
                            : filterClass === 'org'
                              ? t('user:team.org.org')
                              : t('user:team.group.group')
                      },
                      ...paths
                    ]}
                    onClick={(parentId) => {
                      if (parentId === '') {
                        setFilterClass(undefined);
                        onPathClick('');
                      } else if (
                        parentId === 'member' ||
                        parentId === 'org' ||
                        parentId === 'group'
                      ) {
                        setFilterClass(parentId);
                        onPathClick('');
                      } else {
                        onPathClick(parentId);
                      }
                    }}
                    rootName={t('common:common.Team')}
                  />
                </Box>
              )}
              {(filterClass === 'member' || (searchText && filterMembers.length > 0)) && (
                <TeamMemberScrollData
                  flexDirection={'column'}
                  gap={1}
                  userSelect={'none'}
                  height={'fit-content'}
                >
                  {filterMembers?.map((member) => {
                    const onChange = () => {
                      setSelectedMembers((state) => {
                        if (state.includes(member.tmbId)) {
                          return state.filter((v) => v !== member.tmbId);
                        }
                        return [...state, member.tmbId];
                      });
                    };
                    const collaborator = collaboratorList?.find((v) => v.tmbId === member.tmbId);
                    return (
                      <MemberItemCard
                        avatar={member.avatar}
                        key={member.tmbId}
                        name={member.memberName}
                        permission={collaborator?.permission.value}
                        onChange={onChange}
                        isChecked={selectedMemberIdList.includes(member.tmbId)}
                        orgs={member.orgs}
                      />
                    );
                  })}
                </TeamMemberScrollData>
              )}

              {(filterClass === 'org' || searchText) &&
                (() => {
                  const orgs = filterOrgs?.map((org) => {
                    const onChange = () => {
                      setSelectedOrgIdList((state) => {
                        if (state.includes(org._id)) {
                          return state.filter((v) => v !== org._id);
                        }
                        return [...state, org._id];
                      });
                    };
                    const collaborator = collaboratorList?.find((v) => v.orgId === org._id);
                    return (
                      <HStack
                        justifyContent="space-between"
                        key={org._id}
                        py="2"
                        px="3"
                        borderRadius="sm"
                        alignItems="center"
                        _hover={HoverBoxStyle}
                        onClick={onChange}
                      >
                        <Checkbox
                          isChecked={selectedOrgIdList.includes(org._id)}
                          pointerEvents="none"
                        />
                        <MyAvatar src={org.avatar} w="1.5rem" borderRadius={'50%'} />
                        <HStack ml="2" w="full" gap="5px">
                          <Text>{org.name}</Text>
                          {org.count && (
                            <>
                              <Tag size="sm" my="auto">
                                {org.count}
                              </Tag>
                            </>
                          )}
                        </HStack>
                        <PermissionTags permission={collaborator?.permission.value} />
                        {org.count && (
                          <MyIcon
                            name="core/chat/chevronRight"
                            w="16px"
                            p="4px"
                            rounded={'6px'}
                            _hover={{
                              bgColor: 'myGray.200'
                            }}
                            onClick={(e) => {
                              onClickOrg(org);
                              // setPath(getOrgChildrenPath(org));
                              e.stopPropagation();
                            }}
                          />
                        )}
                      </HStack>
                    );
                  });
                  return searchText ? (
                    orgs
                  ) : (
                    <OrgMemberScrollData>
                      {orgs}
                      {orgMembers.map((member) => {
                        return (
                          <MemberItemCard
                            avatar={member.avatar}
                            key={member.tmbId}
                            name={member.memberName}
                            onChange={() => {
                              setSelectedMembers((state) => {
                                if (state.includes(member.tmbId)) {
                                  return state.filter((v) => v !== member.tmbId);
                                }
                                return [...state, member.tmbId];
                              });
                            }}
                            isChecked={selectedMemberIdList.includes(member.tmbId)}
                            orgs={member.orgs}
                          />
                        );
                      })}
                    </OrgMemberScrollData>
                  );
                })()}
              {filterGroups?.map((group) => {
                const onChange = () => {
                  setSelectedGroupIdList((state) => {
                    if (state.includes(group._id)) {
                      return state.filter((v) => v !== group._id);
                    }
                    return [...state, group._id];
                  });
                };
                const collaborator = collaboratorList?.find((v) => v.groupId === group._id);
                return (
                  <MemberItemCard
                    avatar={group.avatar}
                    key={group._id}
                    name={
                      group.name === DefaultGroupName ? userInfo?.team.teamName ?? '' : group.name
                    }
                    permission={collaborator?.permission.value}
                    onChange={onChange}
                    isChecked={selectedGroupIdList.includes(group._id)}
                  />
                );
              })}
            </Flex>
          </Flex>

          <Flex h={'100%'} p="4" flexDirection="column">
            <Box>
              {`${t('user:has_chosen')}: `}
              {selectedMemberIdList.length + selectedGroupIdList.length + selectedOrgIdList.length}
            </Box>
            <Flex flexDirection="column" mt="2" gap={1} overflow={'auto'} flex={'1 0 0'} h={0}>
              {selectedList.map((item) => {
                return (
                  <MemberItemCard
                    key={item.id}
                    avatar={item.avatar}
                    name={item.name ?? ''}
                    onChange={item.onDelete}
                    onDelete={item.onDelete}
                    orgs={item?.orgs}
                  />
                );
              })}
            </Flex>
          </Flex>
        </Grid>
      </ModalBody>
      <ModalFooter>
        {!addOnly && !!permissionList && (
          <PermissionSelect
            value={selectedPermission}
            Button={
              <Flex
                alignItems={'center'}
                bg={'myGray.50'}
                border="base"
                fontSize={'sm'}
                px={3}
                borderRadius={'md'}
                h={'32px'}
              >
                {t(perLabel as any)}
                <ChevronDownIcon fontSize={'md'} />
              </Flex>
            }
            onChange={(v) => setSelectedPermission(v)}
          />
        )}
        {addOnly && (
          <HStack bg={'blue.50'} color={'blue.600'} padding={'6px 12px'} rounded={'5px'}>
            <MyIcon name="common/info" w="1rem" h="1rem" />
            <Text fontSize="12px">{t('user:permission_add_tip')}</Text>
          </HStack>
        )}
        <Button isLoading={isUpdating} ml="4" h={'32px'} onClick={onConfirm}>
          {t('common:common.Confirm')}
        </Button>
      </ModalFooter>
    </MyModal>
  );
}

export default MemberModal;
