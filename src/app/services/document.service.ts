// Document service stub — wire to an API client once the documents
// repository is implemented.
export const documentService = {
  async list() {
    return [] as { id: string; name: string; url: string }[];
  },
};
