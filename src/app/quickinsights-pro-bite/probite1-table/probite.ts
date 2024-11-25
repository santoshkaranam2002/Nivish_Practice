export interface Order {
IssueDocuments: any;
IssueDocumentsUrl: any;
    id: number;
  description: string;
  amount: string;
  price: string;
  stuts: string;
  actions: { label: string; icon: string; action: () => void; }[];
  Infoseek_Status?: string; // Optional fields
  ClassAndSection?: string;
  Schools?: string;
  Enterprise_Group?: string;
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }