// export type TableListItem = {
//   key: number;
//   disabled?: boolean;
//   href: string;
//   avatar: string;
//   name: string;
//   owner: string;
//   desc: string;
//   callNo: number;
//   status: string;
//   updatedAt: Date;
//   createdAt: Date;
//   progress: number;
// };

// export type TableListPagination = {
//   total: number;
//   pageSize: number;
//   current: number;
// };

// export type TableListData = {
//   list: TableListItem[];
//   pagination: Partial<TableListPagination>;
// };

// export type TableListParams = {
//   status?: string;
//   name?: string;
//   desc?: string;
//   key?: number;
//   pageSize?: number;
//   currentPage?: number;
//   filter?: Record<string, any[]>;
//   sorter?: Record<string, any>;
// };

export type SearchBtnCrtlsItem = {
  content: string;
  type: "default" | "primary" | "link" | "text" | "ghost" | "dashed" | undefined;
  event: MouseEventHandler<HTMLElement> | undefined;
  loading?: boolean;
  visibleSwitch?: boolean
}

export type IEssay = {
  infoId: number,
  text: string,
  source: string,
  createTime: number,
  updateTime: number,
  url: string
}