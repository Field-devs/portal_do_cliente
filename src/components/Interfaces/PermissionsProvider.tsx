import { useState, createContext } from 'react';

enum Modules {
    All = 0,
    DashBoard = 1,
    PartnerCliente = 2,
    PartnerAva = 3,
    PartnerCommercial = 4,
    PartnerAffiliate = 5,
}

interface Permission {
    Module: Modules;
    profile_id: number;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
}

interface PermissionsContextType {
    permissions: Permission[]
  }

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    
    const PermissionsData: Permission[] = [
        {
            profile_id: 1,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canView: true,
            Module: Modules.All
        },
        {
            profile_id: 1,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canView: true,
            Module: Modules.PartnerCliente
        }
    ];
    //setPermissions(PermissionsData);

    return (
        <PermissionsContext.Provider value={{ permissions  }}>
          {children}
        </PermissionsContext.Provider>
      );

}






