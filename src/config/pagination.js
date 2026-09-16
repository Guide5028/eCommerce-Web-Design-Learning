export function createPagination(defaultPageSize = 20) {
  return {
    defaultPageSize: 20,
    defaultCurrent: 1,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };
}
