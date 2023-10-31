// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface Post {
    id: number;
    sample_url: string;
    file_url: string;
    width: number;
    height: number;
    tags: string[];
    source: string;
  }
}

export {};
