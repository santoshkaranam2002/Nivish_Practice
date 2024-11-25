export interface TableColumn {
    name: string;
    dataKey: string;
    position?: 'right' | 'left';
    isSortable?: boolean;
    iconName?: string;
    displayAsIcon: boolean;
    float?: 'right'| 'left';
    customOptions?: CustomOption[];
  }

  export interface CustomOption {
    label: string;
    icon: string;
    action: (rowData: any) => void;
  }
