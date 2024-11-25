export interface participants {
    sno: number;
    uin: any;
    studentFullName:any;
    classandSection:any;
    rollNo:any;
    regnNo:any;
    stuts:any;
    customOptions?: CustomOption[];
  }

  export interface couminication {
    index: number;
    UIN: any;
    Name: any;
    class_name: any;
    section_name: any;
    Communication_Name: any;
    actions?: CustomOption[];
  }

  export interface studentcouminication {
    index: number;
    UIN: any;
    Name: any;
    class_name: any;
    section_name: any;
    Communication_Name: any;
    actions?: CustomOption[];
  }


 

  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }