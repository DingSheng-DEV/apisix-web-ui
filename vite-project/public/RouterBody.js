export default [
  {
    uris: [],
    methods: [],
    hosts: [],
    name: "",
    desc: "",
    remote_addrs: [],
    script: "",
    priority: 0,
    upstream_id: "",
    service_id: "",
    script: "",
    upstream: {
      type: "",
      nodes: {},
    },
    timeout: {
      connect: 0,
      send: 0,
      read: 0,
    },
    enable_websocket: false,
    status: 1, //当设置为 1 时，启用该路由，默认值为 1。
  },
];
