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
    Symbol:any;
    Party:any;
    PostalVotes:any;
    Total:any;
    VotesPolledPer:any;
    TotalElectors:any;
    ElectionYear:any;
    ElectionDate:any;
    ACPCByPoll:any;
    StateUTName:any;
    ACNO:any;
    ACCategory:any;
    WinOrder:any;
    PCName:any;
    ServiceVotes:any;
    customOptions?: CustomOption[];
  }
  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }