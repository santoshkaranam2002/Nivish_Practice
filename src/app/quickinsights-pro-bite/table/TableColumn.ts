export interface TableColumn {
  name: string;
  dataKey: string;
  position?: 'right' | 'left' | 'center';
  isSortable?: boolean;
  iconName?: string;
  float?: 'right'| 'left';
  displayAsIcon: boolean;
  customOptions?: CustomOption[];
}

export interface CustomOption {
  label: string;
  icon: string;
  action: (rowData: any) => void;
}
