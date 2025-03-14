<!-- SocialView.vue -->
<template>
  <div class="social-container">
    <!-- 动态发布 -->
    <div class="post-card">
      <van-field
        v-model="newPost"
        rows="3"
        autosize
        type="textarea"
        placeholder="分享你的健康生活..."
      />
      <div class="post-actions">
        <van-uploader v-model="uploadImages" multiple :max-count="3" />
        <van-button type="primary" size="small" @click="submitPost">发布</van-button>
      </div>
    </div>

    <!-- 动态列表 -->
    <div class="posts-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="post-item" v-for="post in posts" :key="post.id">
            <div class="post-header">
              <van-image
                round
                width="40"
                height="40"
                :src="post.avatar"
              />
              <div class="post-info">
                <span class="username">{{ post.username }}</span>
                <span class="time">{{ post.time }}</span>
              </div>
            </div>
            <div class="post-content">
              <p>{{ post.content }}</p>
              <div class="post-images" v-if="post.images && post.images.length">
                <van-image
                  v-for="(img, index) in post.images"
                  :key="index"
                  :src="img"
                  width="100"
                  height="100"
                  fit="cover"
                />
              </div>
            </div>
            <div class="post-footer">
              <van-button icon="like-o" size="small" plain @click="likePost(post)">
                {{ post.likes }}
              </van-button>
              <van-button icon="comment-o" size="small" plain @click="showComments(post)">
                {{ post.comments.length }}
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 评论弹出层 -->
    <van-popup v-model:show="showCommentPopup" position="bottom" round>
      <div class="comments-container">
        <div class="comments-header">
          评论 ({{ currentPost?.comments.length || 0 }})
          <van-icon name="cross" @click="showCommentPopup = false" />
        </div>
        <div class="comments-list">
          <div class="comment-item" v-for="comment in currentPost?.comments" :key="comment.id">
            <van-image
              round
              width="32"
              height="32"
              :src="comment.avatar"
            />
            <div class="comment-content">
              <div class="comment-user">{{ comment.username }}</div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
        </div>
        <div class="comment-input">
          <van-field
            v-model="newComment"
            placeholder="写下你的评论..."
            :border="false"
          >
            <template #button>
              <van-button size="small" type="primary" @click="submitComment">发送</van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

const newPost = ref('')
const uploadImages = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showCommentPopup = ref(false)
const newComment = ref('')
const currentPost = ref(null)

// 模拟数据
const posts = ref([
  {
    id: 1,
    username: '健康达人',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '10分钟前',
    content: '今天完成了5公里跑步，感觉超棒！💪',
    images: ['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'],
    likes: 12,
    comments: [
      {
        id: 1,
        username: '跑步爱好者',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        content: '太棒了！坚持就是胜利！'
      }
    ]
  },
  {
    id: 2,
    username: '营养师小王',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    time: '1小时前',
    content: '分享一道健康沙拉的做法...',
    images: [
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    ],
    likes: 18,
    comments: []
  }
])

const submitPost = () => {
  if (!newPost.value.trim()) {
    showToast('请输入内容')
    return
  }
  // TODO: 实现发布逻辑
  showToast('发布成功')
  newPost.value = ''
  uploadImages.value = []
}

const onRefresh = () => {
  // TODO: 实现刷新逻辑
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const onLoad = () => {
  // TODO: 实现加载更多逻辑
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 1000)
}

const likePost = (post: any) => {
  post.likes++
  showToast('点赞成功')
}

const showComments = (post: any) => {
  currentPost.value = post
  showCommentPopup.value = true
}

const submitComment = () => {
  if (!newComment.value.trim()) {
    showToast('请输入评论内容')
    return
  }
  // TODO: 实现评论逻辑
  if (currentPost.value) {
    currentPost.value.comments.push({
      id: Date.now(),
      username: '当前用户',
      avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
      content: newComment.value
    })
  }
  newComment.value = ''
  showToast('评论成功')
}
</script>

<style scoped>
.social-container {
  padding: 16px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.post-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.post-info {
  margin-left: 12px;
}

.username {
  font-weight: bold;
  display: block;
}

.time {
  font-size: 12px;
  color: #999;
}

.post-content {
  margin-bottom: 12px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.post-footer {
  display: flex;
  gap: 12px;
}

.comments-container {
  padding: 16px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  font-weight: bold;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
}

.comment-content {
  margin-left: 12px;
  flex: 1;
}

.comment-user {
  font-weight: bold;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 14px;
}

.comment-input {
  border-top: 1px solid #eee;
  padding-top: 16px;
}
</style>
