export type Member = {
  avatar: string;
  realName: string;
  nickName: string;
  email: string;
  outUserNo: string;
  phone: string;
  role: RoleType;
  permission?: string[];
};

export type RoleMapType = Record<
  string,
  {
    name: string;
    desc: string;
  }
>;
export type RoleType = 'admin' | 'operator';
const RoleMap: RoleMapType = {
  admin: {
    name: '管理员',
    desc: '仅拥有指定项目的权限',
  },
  operator: {
    name: '操作员',
    desc: '拥有所有权限',
  },
};
const tableListDataSource: Member[] = [];
const realNames = ['马巴巴', '测试', '测试2', '测试3'];
const nickNames = ['巴巴', '测试', '测试2', '测试3'];
const emails = ['baba@antfin.com', 'test@antfin.com', 'test2@antfin.com', 'test3@antfin.com'];
const phones = ['12345678910', '10923456789', '109654446789', '109223346789'];
const permissions = [[], ['权限点名称1', '权限点名称4'], ['权限点名称1'], []];
for (let i = 0; i < 30; i += 1) {
  tableListDataSource.push({
    outUserNo: `${102047 + i}`,
    avatar: `//work.alibaba-inc.com/photo/${102047 + i}.32x32.jpg`,
    role: i === 0 ? 'admin' : 'operator',
    realName: realNames[i % 4],
    nickName: nickNames[i % 4],
    email: emails[i % 4],
    phone: phones[i % 4],
    permission: permissions[i % 4],
  });
}


const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
    ],
  },
];

export { tableListDataSource, treeData }
