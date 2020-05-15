<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left:10px;"
        @click="submitForm"
      >
        {{ isEdit ? '编辑电子书' : '新增电子书' }}
      </el-button>
    </sticky>
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <!-- 上传控件的具体样式 -->
          <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput
              v-model="postForm.title"
              :maxlength="100"
              name="name"
              required
            >
              书名
            </MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="author"
                label="作者: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="publisher"
                label="出版社: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="language"
                label="语言: "
                :label-width="labelWidth"
              >
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="rootFile"
                label="根文件: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.rootFile"
                  placeholder="根文件"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="filePath"
                label="文件路径: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.filePath"
                  placeholder="文件路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="unzipPath"
                label="解压路径: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.unzipPath"
                  placeholder="解压路径"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="coverPath"
                label="封面路径: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="originalName"
                label="文件名称: "
                :label-width="labelWidth"
              >
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="cover"
                label="封面: "
                label-width="labelWidth"
              >
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img" />
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="contents"
                :label-width="labelWidth"
                label="目录: "
              >
                <div
                  v-if="contentsTree && contentsTree.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'
import { createBook, getBook, updateBook } from '../../../api/book'

const defaultForm = {
  title: '',
  author: '',
  publisher: '',
  language: '',
  rootFile: '',
  cover: '',
  url: '',
  originalName: '',
  fileName: '',
  coverPath: '',
  filePath: '',
  unzipPath: ''
}
const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}
export default {
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {
        // status: 'deleted'
        ...defaultForm
      },
      fileList: [],
      labelWidth: '120px',
      contentsTree: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  mounted() {},
  methods: {
    OnSuccess(response) {
      const { msg } = response
      this.$notify({
        title: '操作成功',
        message: msg,
        type: 'success',
        duration: 2000
      })
      this.loading = false
    },
    getBookData(fileName) {
      getBook(fileName).then(response => {
        this.setData(response.data)
      })
    },
    onContentClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.contentsTree = []
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    showGuide() {
      // console.log('object')
    },
    submitForm() {
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          // console.log(valid, fields)
          if (valid) {
            const book = Object.assign({}, this.postForm)
            delete book.contentsTree
            if (!this.isEdit) {
              createBook(book)
                .then(response => {
                  this.OnSuccess(response)
                  this.setDefault()
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              updateBook(book)
                .then(response => {
                  this.OnSuccess(response)
                })
                .catch(() => {
                  this.loading = false
                })
            }
          } else {
            // 222
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    },
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        contentsTree,
        contents
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        contentsTree,
        contents
      }
      this.contentsTree = contentsTree
      this.fileList = [{ name: originalName || fileName, url }]
    },
    onUploadSuccess(data) {
      this.setData(data)
    },
    onUploadRemove() {
      // console.log('onUploadRemove')
      this.setDefault()
    }
  }
}
</script>

<style scoped lang="scss">
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>
