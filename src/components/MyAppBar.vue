<template>
  <mu-appbar style="width: 100%; position: sticky; top: 0" color="primary" class="appbar">
    <div slot="left" style="display: flex">
      <mu-button icon @click="back">
        <mu-icon value="arrow_back_ios" size="32"></mu-icon>
      </mu-button>
      <mu-button flat class="mu-appbar-title showOnlyPC" @click="jumpToWebsiteRoot"
                 style="align-self: center; height: 48px;">
        战斗吧歌姬小程序镜像站
      </mu-button>
    </div>

    <div class="showOnlyMobile" :class="mobileTitleCssClass">
      战斗吧歌姬<br v-if="showIconButtons">小程序镜像站
    </div>

    <div v-if="showIconButtons" slot="right" style="display: flex">
      <div class="mu-appbar-title showOnlyPC">{{ idol_name[$store.state.showType % 10] }}</div>
      <mu-menu style="align-self: center" placement="bottom-end" :open.sync="menuOpen0">
        <mu-button icon>
          <mu-icon value="auto_stories" size="32"></mu-icon>
        </mu-button>
        <mu-container slot="content">
          <mu-flex align-items="center">
            <span style="margin: 0 16px;">
              第
              <mu-text-field v-model="inputPageValue" style="width: 77px;" :action-icon="action_icon"
                             :action-click="onClickChangePage" :error-text="pageInputErrorText"></mu-text-field>
              /
              {{ totalPageCount }}
              页
            </span>
          </mu-flex>
        </mu-container>
      </mu-menu>
      <mu-menu style="align-self: center" placement="bottom-end" :open.sync="menuOpen1">
        <mu-button icon>
          <mu-icon value="date_range" size="32"></mu-icon>
        </mu-button>
        <div slot="content" style="display: flex; flex-direction: column;">
          <mu-date-picker :date.sync="date"></mu-date-picker>
          <mu-button @click="changeDate" color="primary" style="margin-bottom: 8px; width: 50px; align-self: center">
            确认
          </mu-button>
        </div>
      </mu-menu>
      <mu-menu style="align-self: center" placement="left-end" :open.sync="menuOpen2">
        <mu-button icon>
          <mu-icon value="settings" size="32"></mu-icon>
        </mu-button>
        <mu-list slot="content">
          <mu-list-item button @click="onChangeForumMainType(4)">
            <mu-list-item-content>
              <mu-list-item-title>贝拉</mu-list-item-title>
            </mu-list-item-content>
          </mu-list-item>
          <!--          <mu-list-item button>-->
          <!--            <mu-list-item-action>-->
          <!--              <mu-checkbox v-model="erchuangOnly"></mu-checkbox>-->
          <!--            </mu-list-item-action>-->
          <!--            <mu-list-item-title>-->
          <!--              只看二创-->
          <!--            </mu-list-item-title>-->
          <!--          </mu-list-item>-->
          <mu-list-item>
            <mu-radio :value="0" :input-value="radioValue" @change="onChangeRadio" label="全部帖子"></mu-radio>
          </mu-list-item>
          <mu-list-item>
            <mu-radio :value="10" :input-value="radioValue" @change="onChangeRadio" label="只看二创"></mu-radio>
          </mu-list-item>
          <mu-list-item>
            <mu-radio :value="20" :input-value="radioValue" @change="onChangeRadio" label="只看歌姬"></mu-radio>
          </mu-list-item>
        </mu-list>
      </mu-menu>
      <mu-button icon @click="jumpToAboutPage" style="align-self: center">
        <mu-icon value="info" size="32"></mu-icon>
      </mu-button>
    </div>
  </mu-appbar>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";

@Component
export default class MyAppBar extends Vue {
  idol_name = ["", "卡缇娅", "罗兹", "清歌", "贝拉", "玉藻", "墨汐"]

  get showIconButtons() {
    return this.$route.matched[0].name === 'PostList'
  }

  get radioValue() {
    return Math.floor(this.$store.state.showType / 10) * 10
  }

  date = new Date()
  menuOpen0 = false
  menuOpen1 = false
  menuOpen2 = false

  inputPageValue = 1

  @Watch('$store.state.startPage') onStartPageChange() {
    this.inputPageValue = this.$store.state.startPage + 1
  }

  get mobileTitleCssClass() {
    return this.showIconButtons ? "mobileTitle" : "mobileTitleLong"
  }

  get totalPageCount() {
    return this.$store.state.showType > 0 ? this.$store.state.pageInfos[this.$store.state.showType].pageIds.length : 0
  }

  get action_icon() {
    return !this.pageInputErrorText && this.inputPageValue - 1 !== this.$store.state.startPage ? "done" : ""
  }

  get pageInputErrorText() {
    if (Number.isInteger(Number(this.inputPageValue)) && this.inputPageValue > 0 && this.inputPageValue <= this.totalPageCount) return ""
    else return "无效页码"
  }

  changeType(newType: number) {
    if (this.$store.state.showType !== newType) this.$router.push(`/?type=${newType}`)
  }

  onChangeForumMainType(newType: number) {
    this.menuOpen2 = false
    this.changeType(newType + this.radioValue)
  }

  onChangeRadio(value: number) {
    this.menuOpen2 = false
    this.changeType(this.$store.state.showType % 10 + value)
  }

  jumpToMainPage() {
    let lastType = localStorage.getItem("lastType")
    let lastPage = localStorage.getItem("lastPage")
    let query: any = {}
    if (lastType !== null) query.type = lastType
    if (lastPage !== null) query.page = lastPage
    this.$router.push({path: "/", query})
  }

  jumpToWebsiteRoot() {
    this.$router.push("/")
  }

  jumpToAboutPage() {
    this.$router.push('/about')
  }

  changeToOtherPage(page: string) {
    this.$router.push({query: {page, type: this.$route.query.type}})
  }

  onClickChangePage() {
    this.menuOpen0 = false
    this.changeToOtherPage(String(this.inputPageValue))
  }

  async changeDate() {
    this.menuOpen1 = false
    let res = await this.$store.dispatch('getDateFromPage', this.date)
    if (typeof res === "number") {
      res += 1 // 因为返回的res是以0为起点的
      // 找到了页码，执行跳转
      this.changeToOtherPage(String(res))
    } else {
      this.$toast.error(res)
    }
  }

  back() {
    this.$router.back()
  }
}
</script>

<style scoped>
@media screen and (max-width: 700px) {
  .appbar {
    height: 48px;
  }

  .mobileTitle {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    padding-left: 0;
    padding-right: 0;
  }

  .mobileTitle >>> .mu-button-wrapper {
    padding: 0;
  }

  .showOnlyPC {
    display: none !important;
  }

  .mobileTitleLong {
    display: flex;
  }
}

@media screen and (min-width: 701px) {
  .showOnlyMobile {
    display: none !important;
  }
}

</style>

<style>
@media screen and (max-width: 700px) {
  .appbar > .mu-appbar-left {
    padding-right: 0;
  }

  .appbar > .mu-appbar-title {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
