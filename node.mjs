export const Node = (data, left = null, right = null) => {
  let height = 1;
  let count = 1;

  if (
    data === undefined ||
    data === null ||
    data === "" ||
    typeof data !== "number"
  ) {
    throw new Error("Data is required");
  }

  if (left !== null && typeof left !== "object") {
    throw new Error("Left child must be a Node or null");
  }

  if (right !== null && typeof right !== "object") {
    throw new Error("Right child must be a Node or null");
  }

  if (left !== null && right !== null && left.data > right.data) {
    throw new Error("Left child must be less than right child");
  }

  const updateHeight = () => {
    const leftHeight = left?.getHeight() || 0;
    const rightHeight = right?.getHeight() || 0;
    height = Math.max(leftHeight, rightHeight) + 1;
  };

  // getters
  const getData = () => data;

  const getLeft = () => left;

  const getRight = () => right;

  const getHeight = () => height;

  const getCount = () => count;

  // setters
  const setLeft = (node) => {
    if (node !== null && node.getData() >= data) {
      throw new Error("Left child must be less than parent");
    }
    left = node;
    updateHeight();
    count = (left?.getCount() || 0) + (right?.getCount() || 0) + 1;
  };

  const setRight = (node) => {
    if (node !== null && node.getData() <= data) {
      throw new Error("Right child must be greater than parent");
    }
    right = node;
    updateHeight();
    count = (left?.getCount() || 0) + (right?.getCount() || 0) + 1;
  };
  // Add balance factor for AVL implementation
  const getBalanceFactor = () => {
    const leftHeight = left?.getHeight() || 0;
    const rightHeight = right?.getHeight() || 0;
    return leftHeight - rightHeight;
  };
  return {
    setLeft,
    setRight,
    getData,
    getLeft,
    getRight,
    getHeight,
    getCount,
    getBalanceFactor,
  };
};
