import React, { useMemo } from 'react';
import { Box, ButtonProps, Flex } from '@chakra-ui/react';
import { useUserStore } from '@/web/support/user/useUserStore';
import { useTranslation } from 'next-i18next';
import Avatar from '@fastgpt/web/components/common/Avatar';
import { getTeamList, putSwitchTeam } from '@/web/support/user/team/api';
import { TeamMemberStatusEnum } from '@fastgpt/global/support/user/team/constant';
import { useRequest2 } from '@fastgpt/web/hooks/useRequest';
import MySelect from '@fastgpt/web/components/common/MySelect';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import MyIcon from '@fastgpt/web/components/common/Icon';
import { useRouter } from 'next/router';

const TeamSelector = ({
  showManage,
  onChange,
  ...props
}: Omit<ButtonProps, 'onChange'> & {
  showManage?: boolean;
  onChange?: () => void;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo, initUserInfo } = useUserStore();
  const { setLoading } = useSystemStore();

  const { data: myTeams = [] } = useRequest2(() => getTeamList(TeamMemberStatusEnum.active), {
    manual: false,
    refreshDeps: [userInfo]
  });

  const { runAsync: onSwitchTeam } = useRequest2(
    async (teamId: string) => {
      setLoading(true);
      await putSwitchTeam(teamId);
      return initUserInfo();
    },
    {
      onFinally: () => {
        setLoading(false);
        onChange?.();
      },
      errorToast: t('common:user.team.Switch Team Failed')
    }
  );

  const teamList = useMemo(() => {
    return myTeams.map((team) => ({
      icon: team.avatar,
      iconSize: '1.25rem',
      label: team.teamName,
      value: team.teamId
    }));
  }, [myTeams]);

  const formatTeamList = useMemo(() => {
    return [
      ...(showManage
        ? [
            {
              icon: 'common/setting',
              iconSize: '1.25rem',
              label: t('user:manage_team'),
              value: 'manage',
              showBorder: true
            }
          ]
        : []),
      ...teamList
    ];
  }, [showManage, t, teamList]);

  const handleChange = (value: string) => {
    if (value === 'manage') {
      router.push('/account/team');
    } else {
      onSwitchTeam(value);
    }
  };

  return (
    <Box w={'100%'}>
      <MySelect
        {...props}
        value={userInfo?.team?.teamId}
        list={formatTeamList}
        onChange={handleChange}
      />
    </Box>
  );
};

export default TeamSelector;
