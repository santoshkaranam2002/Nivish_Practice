export interface StudentTable {
    HealthCampType: any;
    EnterpriseName: string;
    type: any;
    customOptions?: CustomOption[]; 
}

export interface eventresource {
  FullName: string;
  Category: string | null;
  CampDates: string;
  Station_Names: string;
}
export interface CustomOption {
  label: string;
  icon: string;
  action: (rowData: any) => void; 
}