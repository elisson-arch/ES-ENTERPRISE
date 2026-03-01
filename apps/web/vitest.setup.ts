import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do Fetch global
global.fetch = vi.fn();
