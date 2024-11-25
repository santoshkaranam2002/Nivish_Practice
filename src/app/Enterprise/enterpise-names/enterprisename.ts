export interface Name {
    sno: number;
    description: any;
    amount: string;
    // price: string;
    stuts: any;
    // viewstat: any;
    customOptions?: CustomOption[]; // Add custom options property
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void; // Function to handle the action
  }  