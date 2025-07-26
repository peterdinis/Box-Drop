import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    canView: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  lastActive: Date;
  status: 'online' | 'offline' | 'away';
}

interface TeamContextType {
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateMemberPermissions: (id: string, permissions: Partial<TeamMember['permissions']>) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: TeamMember['role']) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'owner',
      permissions: {
        canView: true,
        canDownload: true,
        canEdit: true,
        canShare: true,
        canDelete: true
      },
      lastActive: new Date(),
      status: 'online'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      permissions: {
        canView: true,
        canDownload: true,
        canEdit: true,
        canShare: true,
        canDelete: false
      },
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      status: 'away'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'editor',
      permissions: {
        canView: true,
        canDownload: true,
        canEdit: true,
        canShare: false,
        canDelete: false
      },
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'offline'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@company.com',
      role: 'viewer',
      permissions: {
        canView: true,
        canDownload: true,
        canEdit: false,
        canShare: false,
        canDelete: false
      },
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'offline'
    }
  ]);

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateMemberPermissions = (id: string, permissions: Partial<TeamMember['permissions']>) => {
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === id
          ? { ...member, permissions: { ...member.permissions, ...permissions } }
          : member
      )
    );
  };

  const removeMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateMemberRole = (id: string, role: TeamMember['role']) => {
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, role } : member
      )
    );
  };

  return (
    <TeamContext.Provider
      value={{
        teamMembers,
        addTeamMember,
        updateMemberPermissions,
        removeMember,
        updateMemberRole
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};