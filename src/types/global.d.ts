// Extend the Document interface
declare interface Document {
  startViewTransition?(callback: () => void): void;
}
