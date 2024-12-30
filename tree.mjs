import { Node } from "./node.mjs";

export const Tree = (array) => {
  let root = null;

  // initialize the tree
  const prepareArray = (arr) => {
    return [...new Set(arr)].sort((a, b) => a - b);
  };

  const buildTreeHelper = (sortedArray, start, end) => {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node = Node(sortedArray[mid]);

    node.setLeft(buildTreeHelper(sortedArray, start, mid - 1));
    node.setRight(buildTreeHelper(sortedArray, mid + 1, end));

    return node;
  };

  const buildTree = (arr) => {
    if (!Array.isArray(arr)) {
      throw new Error("Input must be an array");
    }
    const sortedArray = prepareArray(arr);
    return buildTreeHelper(sortedArray, 0, sortedArray.length - 1);
  };

  root = buildTree(array);

  // tree actions
  const insert = (value) => {
    const newNode = Node(value);
    root = insertHelper(root, newNode);
  };

  const insertHelper = (node, newNode) => {
    if (node === null) return newNode;
    if (newNode.getData() < node.getData()) {
      node.setLeft(insertHelper(node.getLeft(), newNode));
    } else {
      node.setRight(insertHelper(node.getRight(), newNode));
    }
    return node;
  };

  const deleteItem = (value) => {
    root = deleteHelper(root, value);
  };

  const deleteHelper = (node, value) => {
    if (node === null) return null;

    if (value < node.getData()) {
      node.setLeft(deleteHelper(node.getLeft(), value));
    } else if (value > node.getData()) {
      node.setRight(deleteHelper(node.getRight(), value));
    } else {
      // Found the node to delete!

      // Case 1: No children or one child
      if (node.getLeft() === null) {
        return node.getRight();
      } else if (node.getRight() === null) {
        return node.getLeft();
      }

      // Case 2: Two children
      let successor = findMin(node.getRight());
      node.setData(successor.getData());
      node.setRight(deleteHelper(node.getRight(), successor.getData()));
    }
    return node;
  };

  const findMin = (node) => {
    while (node.getLeft() !== null) {
      node = node.getLeft();
    }
    return node;
  };

  const find = (value) => {
    return findHelper(root, value);
  };

  const findHelper = (node, value) => {
    if (node === null) return null;
    if (node.getData() === value) return node;
    if (value < node.getData()) return findHelper(node.getLeft(), value);
    return findHelper(node.getRight(), value);
  };

  // getters
  const getRoot = () => root;

  const printTree = () => {
    console.log("Tree structure:");
    prettyPrint(root);
  };

  const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.getRight() !== null) {
      prettyPrint(
        node.getRight(),
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.getData()}`);
    if (node.getLeft() !== null) {
      prettyPrint(node.getLeft(), `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  // Iterative approach using a queue
  const levelOrderIterative = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    if (!root) return;

    const queue = [root]; // Initialize queue with root node

    while (queue.length > 0) {
      const currentNode = queue.shift(); // Remove first node from queue

      callback(currentNode); // Process current node

      // Add children to queue if they exist
      if (currentNode.getLeft()) {
        queue.push(currentNode.getLeft());
      }
      if (currentNode.getRight()) {
        queue.push(currentNode.getRight());
      }
    }
  };

  // Recursive approach
  const levelOrderRecursive = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    const height = root.getHeight();

    // Process all nodes at each level
    for (let level = 1; level <= height; level++) {
      processLevel(root, level, callback);
    }
  };

  // Helper function to process nodes at a given level
  const processLevel = (node, level, callback) => {
    if (!node) return;

    if (level === 1) {
      callback(node);
    } else if (level > 1) {
      processLevel(node.getLeft(), level - 1, callback);
      processLevel(node.getRight(), level - 1, callback);
    }
  };

  const getTreeHeight = () => {
    // This would get height of entire tree from root
    return root ? root.getHeight() : 0;
  };

  const isBalanced = () => {
    // Uses node's getHeight but implements tree-wide logic
    const checkBalance = (node) => {
      if (!node) return true;

      const balanceFactor = node.getBalanceFactor();
      return (
        Math.abs(balanceFactor) <= 1 &&
        checkBalance(node.getLeft()) &&
        checkBalance(node.getRight())
      );
    };

    return checkBalance(root);
  };

  const rebalance = () => {
    if (!isBalanced()) {
      const values = [];
      // Collect values using node methods
      levelOrderIterative((node) => values.push(node.getData()));
      // Rebuild tree
      root = buildTree(values);
    }
  };

  // Depth-first traversal methods
  const inOrder = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    const inOrderHelper = (node) => {
      if (node === null) return;

      inOrderHelper(node.getLeft()); // Left
      callback(node); // Root (current node)
      inOrderHelper(node.getRight()); // Right
    };

    inOrderHelper(root);
  };

  const preOrder = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    const preOrderHelper = (node) => {
      if (node === null) return;

      callback(node); // Root (current node)
      preOrderHelper(node.getLeft()); // Left
      preOrderHelper(node.getRight()); // Right
    };

    preOrderHelper(root);
  };

  const postOrder = (callback) => {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    const postOrderHelper = (node) => {
      if (node === null) return;

      postOrderHelper(node.getLeft()); // Left
      postOrderHelper(node.getRight()); // Right
      callback(node); // Root (current node)
    };

    postOrderHelper(root);
  };

  const depth = (targetNode) => {
    if (!targetNode) {
      throw new Error("Node is required");
    }

    const findDepth = (currentNode, target, currentDepth = 0) => {
      if (!currentNode) return -1; // Node not found

      if (currentNode.getData() === target.getData()) {
        return currentDepth; // Found the node!
      }

      // Search left subtree
      if (target.getData() < currentNode.getData()) {
        return findDepth(currentNode.getLeft(), target, currentDepth + 1);
      }

      // Search right subtree
      return findDepth(currentNode.getRight(), target, currentDepth + 1);
    };

    return findDepth(root, targetNode);
  };

  return {
    getRoot,
    printTree,
    buildTree,
    insert,
    deleteItem,
    find,
    levelOrderIterative,
    levelOrderRecursive,
    getTreeHeight,
    isBalanced,
    rebalance,
    inOrder,
    preOrder,
    postOrder,
    depth,
  };
};
