export default [
  {
    http: "get",
    url: "/apisix/admin/routes",
    desc: "获取资源列表",
  },
  {
    http: "get",
    url: "/apisix/admin/routes",
    body: {
      id: "",
    },
    desc: "根据id获取资源",
  },
  {
    http: "post",
    url: "/apisix/admin/routes",
    body: {
      uris: ["/a", "/b"],
      methods: ["GET", "POST"],
      hosts: ["a.com", "b.com"],
      name: "路由 xxx",
      desc: "hello world",
      remote_addrs: ["127.0.0.1"],
      upstream: {
        type: "roundrobin",
        nodes: {
          "127.0.0.1:1980": 1,
        },
      },
    },
    desc: "创建资源",
  },
  {
    http: "delete",
    url: "/apisix/admin/routes",
    body: {
      id: "",
    },
    desc: "删除指定资源",
  },
  {
    http: "patch",
    url: "/apisix/admin/routes",
    body: {
      uris: ["/a", "/b"],
      methods: ["GET", "POST"],
      hosts: ["a.com", "b.com"],
      name: "路由 xxx",
      desc: "hello world",
      remote_addrs: ["127.0.0.1"],
      upstream: {
        type: "roundrobin",
        nodes: {
          "127.0.0.1:1980": 1,
        },
      },
      filter_func: "",
    },
    desc: "标准 PATCH，修改指定 Route 的部分属性",
  },
];
