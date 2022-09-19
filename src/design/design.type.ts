interface DocumentResult<T> extends Document {
  _doc: T;
}

export interface Design extends DocumentResult<Object> {
  _id: string;
  name: string;
  category: string;
  isPremium: boolean;
  keyList: string[];
}

export interface DesignInformation {
  name: string;
  fileCount: number;
  category: string;
  isPremium: boolean;
}

export interface DesignBody {
  name?: string;
  category: string;
  isPremium: boolean;
}
