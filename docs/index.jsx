import { useNavigate } from 'rspress/runtime';


export default function Homepage() {
  const navigate = useNavigate();
  const jumpTo = (url) => navigate(url);

  return (
    <div className="home-container">
      <div className="site-title">Too Young, Too Simple, Sometimes Naive.</div>
      <hr data-content="关于本站和作者" />
      <div className="user-info">
        <div className="basic-info">
          <div className="name">Hello, I'm <strong>Naico Wang</strong>.</div>
          <ul>
            <li>Work as Staff Engineer.</li>
            <li>Used to be an Engineer Lead.</li>
            <li>PMP Certified.</li>
          </ul>
        </div>
        <div className="avatar" />
      </div>
      <hr data-content="服务过的公司" />
      <div className="company-list">
        <img alt="Grain Tech" src="./icons/company-grain.png" />
        <img alt="ChinaSoft" src="./icons/company-chinasoft.png" />
        <img alt="MicroSoft" src="./icons/company-microsoft.png" />
        <img alt="Mercer" src="./icons/company-mercer.png" />
        <img alt="Farfetch" src="./icons/company-farfetch.png" />
        <img alt="Marriott" src="./icons/company-marriott.png" />
      </div>
      <hr data-content="推荐内容" />
      <div className="content-list">
        <div className="item-list">
          <div className="item number-1" onClick={jumpTo.bind(this, "/architect/")}>软件架构</div>
          <div className="item number-2" onClick={jumpTo.bind(this, "/interview/")}>面试八股文</div>
          <div className="item number-3" onClick={jumpTo.bind(this, "/algorithm/")}>算法与数据结构</div>
          <div className="item number-4" onClick={jumpTo.bind(this, "/reading/architect-basic/")}>架构基础</div>
          <div className="item number-5" onClick={jumpTo.bind(this, "/reading/react-hooks/")}>React Hooks 核心原理</div>
        </div>
      </div>
    </div>
  )
}

export const frontmatter = {
  // 声明布局类型
  pageType: 'custom',
};
