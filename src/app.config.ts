export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/my/my'

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
//   tabBar: {
//     color: '#C1C1CB',
//     selectedColor: '#161618',
//     backgroundColor: '#fff',
//     borderStyle: 'white',
//     list: [
//         {
//             pagePath: 'pages/index/index',
//             text: '้ฆ้กต',
//             iconPath: './assets/tabbar/index.png',
//             selectedIconPath: './assets/tabbar/index-active.png'
//         },
//         {
//             pagePath: 'pages/my/my',
//             text: 'ๆ็',
//             iconPath: './assets/tabbar/my.png',
//             selectedIconPath: './assets/tabbar/my-active.png'
//         }
//     ]
// }
})
