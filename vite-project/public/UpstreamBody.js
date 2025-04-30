export default [
  {
    retries: 1,
    timeout: {
      connect: 0,
      send: 0,
      read: 0,
    },
    nodes: {},
    type: "", //枚举	负载均衡算法，默认值是roundrobin。
    checks: {},
    hash_on: "",
    key: "",
    name: "",
    desc: "",
    scheme: "", //[http, https, grpc, grpcs]。
    labels: {},
    "tls.client_cert_id": "",
  },
];
