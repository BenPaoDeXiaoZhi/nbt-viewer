export enum TagID {
  Empty = 0x00,
  Byte = 0x01,
  Short = 0x02,
  Int = 0x03,
  Long = 0x04,
  Float = 0x05,
  Double = 0x06,
  ByteArray = 0x07, // 按小端序[仅BE]存储的有符号整型长度，后跟相应个数的有符号字节
  String = 0x08, // 一个带长字符串，包含按小端序[仅BE]存储的有符号短整型[仅BE]长度。字符串是按标准UTF-8编码[仅BE]书写的
  List = 0x09, // 列表中标签的标签ID，后跟按小端序[仅BE]存储的有符号整型长度，后跟相应个数的子标签负载
  ComplexObject = 0x0a, // 若干个子标签整体（ID、名称、负载），后跟空字节（可视为结束标签）
  IntArray = 0x0b, // 按小端序[仅BE]存储的有符号整型长度，后跟相应个数的有符号整型
}

export type NBTChunkData = {
  value: TypedValue<NBTType>;
  name: string;
};

export type NBTType =
  | number
  | string
  | bigint
  | TypedValue<NBTType>[]
  | { [n: string]: TypedValue<NBTType> };

export async function handleFile(file: File) {
  const view = new PointerDataView(await file.arrayBuffer());
  return readChunk(view);
}

function readChunk(view: PointerDataView, forceTagID?: TagID): NBTChunkData {
  const { tagID, name } = readHead(view, forceTagID);
  let value: NBTType | undefined = undefined;
  switch (tagID) {
    case TagID.Empty:
      value = "";
      break;
    case TagID.Byte:
      value = view.getInt8();
      break;
    case TagID.Short:
      value = view.getInt16();
      break;
    case TagID.Int:
      value = view.getInt32();
      break;
    case TagID.Long:
      value = view.getBigInt64();
      break;
    case TagID.Float:
      value = view.getFloat32();
      break;
    case TagID.Double:
      value = view.getFloat64();
      break;
    case TagID.ByteArray:
      break;
    case TagID.String: {
      const length = view.getUint16();
      value = view.getString(length);
      break;
    }
    case TagID.List: {
      value = [];
      const subTagIDs: TagID = view.getUint8();
      const length = view.getUint32();
      for (let i = 0; i < length; i++) {
        value.push(readChunk(view, subTagIDs).value!);
      }
      break;
    }
    case TagID.ComplexObject: {
      value = Object.create(null) as Record<string, TypedValue<NBTType>>;
      while (1) {
        const { value: subValue, name: subName } = readChunk(view);
        console.log(value, name);
        if (subValue.type == TagID.Empty) {
          break;
        }
        value[subName] = subValue;
      }
      break;
    }
    case TagID.IntArray:
      break;
  }
  if (value === undefined) {
    console.error(view);
    throw new Error(`id:${tagID}`);
  }
  return { value: new TypedValue(value, tagID), name };
}

function readHead(view: PointerDataView, forceTagID?: TagID) {
  const tagID: TagID = forceTagID || view.getUint8(); // ID是表示该标签类型的字节
  if (tagID == TagID.Empty) {
    return { tagID, name: "" };
  }
  const nameLength = forceTagID ? 0 : view.getUint16(); //名称是一个带长字符串，包含一个按小端序[仅BE]存储的无符号短整型
  const name = view.getString(nameLength);
  return { tagID, name };
}

export class TypedValue<T extends NBTType> {
  value: T;
  type: TagID;
  constructor(value: T, type: TagID) {
    this.value = value;
    this.type = type;
  }
}

export class PointerDataView<
  T extends ArrayBufferLike = ArrayBufferLike,
> extends DataView<T> {
  pointer: number = 0;
  constructor(buffer: T) {
    super(buffer);
  }

  getUint8() {
    return super.getUint8((this.pointer += 1) - 1);
  }
  getUint16() {
    return super.getUint16((this.pointer += 2) - 2, true);
  }
  getUint32() {
    return super.getUint32((this.pointer += 4) - 4, true);
  }
  getInt8() {
    return super.getInt8((this.pointer += 1) - 1);
  }
  getInt16() {
    return super.getInt16((this.pointer += 2) - 2, true);
  }
  getInt32() {
    return super.getInt32((this.pointer += 4) - 4, true);
  }
  getBigInt64() {
    return super.getBigInt64((this.pointer += 8) - 8, true);
  }
  getFloat32() {
    return super.getFloat32((this.pointer += 4) - 4, true);
  }
  getFloat64() {
    return super.getFloat64((this.pointer += 8) - 8, true);
  }

  getChar() {
    return String.fromCharCode(this.getUint8());
  }

  getString(length: number) {
    let ret = "";
    for (let i = 0; i < length; i++) {
      ret += this.getChar();
    }
    return ret;
  }
}
