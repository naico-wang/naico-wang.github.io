<template>
  <div class="pagination">
    <button
      :disabled="pageNo === 1"
      @click="emitPageNo(pageNo - 1)"
    >
      上一页
    </button>
    <button
      v-if="startAndEndIndex.start > 1"
      @click="emitPageNo(1)"
      :class="{ active: pageNo === 1 }"
    >
      1
    </button>
    <button v-if="startAndEndIndex.start > 2">···</button>

    <!-- 连续的页码 -->
    <template v-for="(page, index) in startAndEndIndex.end" :key="index">
      <button
        v-if="page >= startAndEndIndex.start"
        :class="{ active: pageNo === page }"
        @click="emitPageNo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button v-if="startAndEndIndex.end < totalPage - 1">···</button>
    <button
      v-if="startAndEndIndex.end < totalPage"
      :class="{ active: pageNo === totalPage }"
      @click="emitPageNo(totalPage)"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo === totalPage"
      @click="emitPageNo(pageNo + 1)"
    >
      下一页
    </button>
  </div>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    pageNo: { // 页码
      type: Number,
      default: 1,
    },
    pageSize: { // 每页个数
      type: Number,
      default: 10,
    },
    total: { // 总条数
      type: Number,
      default: 0,
    },
    continues: { // 页码连续出现的个数
      type: Number,
      default: 5,
    },
    pageSizes: { // 每页显示个数选择器选项
      type: Array,
      default: () => [10, 20, 30, 40],
    },
  },
  setup(props, { emit }) {
    const size = ref(props.pageSize)

    const totalPage = computed(() => Math.ceil(props.total / props.pageSize))

    const startAndEndIndex = computed(() => {
      const { continues, pageNo, totalPage } = props
      let start = 0, end = 0
      if (continues > totalPage) {
        start = 1
        end = totalPage
      } else {
        start = pageNo - parseInt(continues / 2)
        end = pageNo + parseInt(continues / 2)
        if (start < 1) {
          start = 1
          end = continues
        }
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      return { start, end }
    })

    const emitPageNo = (page) => {
      emit('change-page-no', page)
    }

    return {
      size,
      totalPage,
      startAndEndIndex,
      emitPageNo
    }
  },
})
</script>

<style lang="scss" scoped>
.pagination {
  font-size: 13px;
  color: var(--vp-c-indigo-1);
  text-align: center;
  margin: 10px 0 40px;

  button {
    min-width: 32px;
    height: 28px;
    padding: 0 8px;
    margin: 10px 5px 0;
    border: 0;
    border-radius: 2px;
    background: var(--c-bg-light);
    outline: none;
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    color: var(--c-text);
    cursor: pointer;
    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }
    &.active {
      cursor: not-allowed;
      background: var(--vp-c-indigo-1);
      color: #fff;
    }
  }
}
</style>
