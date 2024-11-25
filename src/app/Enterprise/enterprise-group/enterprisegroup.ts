export interface EnterpriseGroup {
    sno: number;
    Group_Name: any;
    // amount: string;
    // price: string;
    // stuts: any;
    customOptions?: CustomOption[];
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }
