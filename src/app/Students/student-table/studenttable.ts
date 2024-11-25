export interface StudentTable {
    Infoseek_Status: string;
    ClassAndSection: any;
    Schools: any;
    Enterprise_Group: any;
    Country: any;
    id: number;
    uin:any;
    description: any;
    amount: string;
    price: string;
    section:string;
    roll:string;
    stuts: any;
    customOptions?: CustomOption[]; 
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }