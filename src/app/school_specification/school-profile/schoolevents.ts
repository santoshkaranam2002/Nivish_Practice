export interface SchoolEvents {
    sno: number;
    Name: any;
    Type:any;
    Date:any;
    stuts:any;
    customOptions?: CustomOption[];
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }