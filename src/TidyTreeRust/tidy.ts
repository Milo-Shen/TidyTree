// Import WebAssembly
import _initWasm, { InitInput, InitOutput, Tidy as TidyWasm, WasmLayoutType as LayoutType } from "../wasm_dist/wasm";

// Import Interface
import { Node } from "../TidyTree/Node";

// Import Utils
import { Disposable } from "./dispose";
import { MockCard } from "../Utils/mock_org_chart_data";

let promise: Promise<InitOutput> | undefined;

export function initWasm(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput> {
  if (!promise) {
    promise = _initWasm(module_or_path);
  }

  return promise;
}

export class TidyLayout extends Disposable {
  private tidy: TidyWasm;
  private nextId = 1;
  private root: Node | undefined;
  private idToNode: Map<number, Node> = new Map();

  static async create(type: LayoutType = LayoutType.Tidy, v_space = 40, h_space = 10, line_width: number = 2) {
    await initWasm();
    return new TidyLayout(type, v_space, h_space, line_width);
  }

  private constructor(type: LayoutType = LayoutType.Tidy, v_space: number, h_space: number, line_width: number) {
    super();

    if (type === LayoutType.Basic) {
      this.tidy = TidyWasm.with_basic_layout(h_space, v_space, line_width);
    } else if (type === LayoutType.Tidy) {
      this.tidy = TidyWasm.with_tidy_layout(h_space, v_space, line_width);
    } else if (type === LayoutType.LayeredTidy) {
      this.tidy = TidyWasm.with_layered_tidy(h_space, v_space, line_width);
    } else {
      throw new Error("not implemented");
    }

    this._register({
      dispose: () => {
        this.tidy.free();
      },
    });
  }

  layout() {
    const nodeLinkedList = this.tidy.get_node_linked_list();
    const lineLinkedList = this.tidy.get_line_linked_list();

    // todo:
    let result = [];
    for (let i = 0; i < nodeLinkedList.length; i += 5) {
      const id = nodeLinkedList[i] | 0;
      const node = this.idToNode.get(id)!;
      node.x = nodeLinkedList[i + 1];
      node.y = nodeLinkedList[i + 2];
      result.push(node);
    }
  }

  load_data(raw_data: Array<MockCard>) {
    if (!this.tidy) {
      return;
    }

    const ids: number[] = [];
    const width: number[] = [];
    const height: number[] = [];
    const parents: number[] = [];

    const len = raw_data.length;

    for (let i = 0; i < len; i++) {
      let node = raw_data[i];
      ids.push(node.id);
      width.push(node.width);
      height.push(node.height);
      parents.push(node.parent ?? -1);
    }

    let r_ids = new Int32Array(ids);
    let r_width = new Float32Array(width);
    let r_height = new Float32Array(height);
    let r_parents = new Int32Array(parents);

    this.tidy.initialize_tree_from_js_code(r_ids, r_width, r_height, r_parents);
    this.tidy.generate_layout();
  }
}

export { LayoutType };
