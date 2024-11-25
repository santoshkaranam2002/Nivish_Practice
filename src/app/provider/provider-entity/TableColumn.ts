export interface StudentTable {
  id: number;
  // HealthCampType: any;
  // EnterpriseName: string;
  price: string;
  section:string;
  stuts: any;
  nid: any;
  NumberOfHCPs: any;
  customOptions?: CustomOption[]; 
}
export interface CustomOption {
label: string;
icon: string;
action: (rowData: any) => void; 
}