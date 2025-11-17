// Re-export all common utilities and types
export * from "./lib/utils";

// Export admin-specific components and types
export * from "./admin";

// Export ecommerce-specific components and types
export * from "./ecommerce";

// Export common types
export type { CustomButtonProps } from "./components/custom/custom-button";

// Import global styles
import './styles/globals.css';
