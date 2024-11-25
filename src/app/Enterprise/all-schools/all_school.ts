export interface EnterpriseGroup {
    sno: number;
    Schools: any;
    PrimaryCoordinator:any;
    SecondaryCoordinator:any;
    LastVerifiedOn:any;
    stuts:any;
    customOptions?: CustomOption[];
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }