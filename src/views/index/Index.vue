<template>
  <div>
    <mt-tab-container :active.sync="control.selectedContainer" v-model="control.selectedContainer" :swipeable="true">
      <mt-tab-container-item id="me-container" class="me-container">
        <div class="head-container">
          <div class="image-container">
            <img :src="user.portrait"/>
          </div>
          <h3>
            {{user.nickname}} <i v-if="user.gender == 0 || user.gender == 1"
                                 :style="{color: user.gender == 0 ? '#ed1e79' : '#29aae3'}"
                                 :class="'fa ' + (user.gender == 0 ? 'fa-female' : 'fa-male') + ' fa-fw'"></i>
          </h3>
          <p>{{user && user.country ? (user.country + ' ' + user.province + user.city) : ''}}</p>
        </div>

        <div class="body-container">
          <ul>
            <li>
              <a @click="scan">
                <img class="icon-left" src="@/assets/svg/scan.svg"/>
                <p>
                  扫一扫<img class="icon-float-right" src="@/assets/svg/right.svg"/>
                </p>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a @click="network">
                <img class="icon-left" src="@/assets/svg/network.svg"/>
                <p class="under-line">
                  网络状态<img class="icon-float-right" src="@/assets/svg/right.svg"/>
                </p>
              </a>
            </li>
            <li>
              <a @click="location">
                <img class="icon-left" src="@/assets/svg/location.svg"/>
                <p class="under-line">
                  地理位置<img class="icon-float-right" src="@/assets/svg/right.svg"/>
                </p>
              </a>
            </li>
            <li>
              <a @click="address">
                <img class="icon-left" src="@/assets/svg/address.svg"/>
                <p>
                  收货地址<img class="icon-float-right" src="@/assets/svg/right.svg"/>
                </p>
              </a>
            </li>
          </ul>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>

    <mt-tabbar :selected.sync="control.selected">
      <mt-tab-item id="me">
        <img slot="icon" src="@/assets/svg/me.svg">
        我
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/system/user'
import { getJsConfig } from '@/api/system/system'

export default {
  name: 'index',
  data() {
    return {
      user: {
        nickname: ''
      },
      control: {
        selected: 'me',
        selectedContainer: 'me-container'
      }
    }
  },
  methods: {
    getUserInfo() {
      // 获取当前登录用户信息
      getUserInfo({}).then(data => {
        this.user = data

        // 初始化js权限
        this.wxConfig()
      })
    },
    wxConfig() {
      // 获取js初始化配置
      getJsConfig({}).then(data => {
        // config接口注入权限验证配置
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: ['getNetworkType', 'getLocation', 'openLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })

        // 验证成功后执行
        wx.ready(function () {
          console.log('wx初始化成功')
        })
      })
    },
    scan() {
      const _this = this

      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (response) {
          const result = response.resultStr // 当needResult 为 1 时，扫码返回的结果
          _this.$messagebox.alert('您扫描的内容是：' + result).then(action => {
          })
        }
      })
    },
    network() {
      const _this = this

      wx.getNetworkType({
        success: function (res) {
          const networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
          _this.$messagebox.alert('当前网络状态：' + networkType).then(action => {
          })
        }
      })
    },
    location() {
      const _this = this

      // 获取地理位置接口
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          const speed = res.speed // 速度，以米/每秒计
          const accuracy = res.accuracy // 位置精度
          const description = '纬度：' + latitude + '，经度：' + longitude + '，速度：' + speed + '，位置精度：' + accuracy
          console.log(description)

          // 使用微信内置地图查看位置接口
          _this.$messagebox.confirm('纬度：' + latitude + '，经度：' + longitude + '，是否打开对应地图？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            // 打开地图坐标
            wx.openLocation({
              latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
              longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
              name: '', // 位置名
              address: '', // 地址详情说明
              scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
              infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            })
          })
        }
      })
    },
    address() {
      const _this = this

      wx.openAddress({
        success: function (res) {
          const userName = res.userName // 收货人姓名
          const postalCode = res.postalCode // 邮编
          const provinceName = res.provinceName // 国标收货地址第一级地址（省）
          const cityName = res.cityName // 国标收货地址第二级地址（市）
          const countryName = res.countryName // 国标收货地址第三级地址（国家）
          const detailInfo = res.detailInfo // 详细收货地址信息
          const nationalCode = res.nationalCode // 收货地址国家码
          const telNumber = res.telNumber // 收货人手机号码
          const description = userName + '(收货人),' + postalCode + '(邮编),' + provinceName + '-' + cityName + '-' + countryName + '-' + detailInfo + '(地址),' + telNumber + '(手机)'
          console.log(nationalCode)

          _this.$messagebox.alert(description).then(action => {
          })
        },
        fail: function () {
          _this.$messagebox.alert('无法获取收货地址').then(action => {
          })
        }
      })
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
  .me-container {
    height: calc(100vh);
    background-color: #ededed;

    .head-container {
      height: 6rem;
      background-color: #ffffff;
      padding: 3rem 0 1.5rem 1.6rem;

      .image-container {
        width: 5rem;
        height: 5rem;
        margin-right: 1rem;
        float: left;

        img {
          width: 5rem;
          height: 5rem;
          border-radius: 0.5rem;
        }
      }

      h3 {
        margin: 0.5rem 0 1.5rem 0;
      }
    }

    .body-container {
      ul {
        list-style: none;
        margin-top: 2rem;
        padding: 0;
        background-color: #ffffff;

        li {
          height: 3rem;
          line-height: 3rem;

          a {
            display: block;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            outline: none;
            background: none;
            text-decoration: none;

            .icon-left {
              width: 1.6rem;
              height: 1.6rem;
              margin: 0.7rem 1.3rem;
              float: left;
            }

            p {
              margin: 0 0 0 4rem;

              .icon-float-right {
                width: 1.2rem;
                height: 1.2rem;
                margin: 0.9rem 0.6rem;
                float: right;
              }
            }

            p.under-line {
              border-bottom: 1px solid #d9d9d9;
            }
          }

          a:active {
            background-color: #e5e5e5;
          }
        }
      }
    }
  }
</style>
