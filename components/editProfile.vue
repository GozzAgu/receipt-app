<template>
  <div class="">    
    <div v-loading="loading" class="py-[0.5em] rounded-b-lg grid grid-cols-1 gap-y-[1em]">
      <el-divider content-position="left"><span class="text-lg text-sky-600">Edit Profile</span></el-divider>

      <el-form
        ref="ruleFormRef"
        :model="user"
        status-icon
        :rules="passwordRules"
        label-width="120px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="md:grid grid-cols-2 gap-[1em]">
          <el-upload
            class="avatar-uploader mb-[1.5em]"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            ref="uploadRef"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar w-[5em]" />
            <el-icon v-else class="avatar-uploader-icon rounded-xl p-[1em] border">+</el-icon>
          </el-upload>

          <el-button @click="uploadImg">
            Save
          </el-button>

          <div class="mt-[1.5em] md:mt-0">
            <el-form-item label="Company name" prop="name">
              <el-input v-model="user.name" placeholder="Company name" />
            </el-form-item>
            <el-form-item label="Company address" prop="address">
              <el-input v-model="user.address" placeholder="Company address" />
            </el-form-item>
            <el-form-item label="Company phone no" prop="phone">
              <el-input v-model="user.phone" placeholder="Company phone no" />
            </el-form-item>

            <el-button @click="update(ruleFormRef)"> 
              <Icon class="text-white ml-[0.5rem]" name="tabler:user-plus" size="15" />
              <span class="ml-[0.2em] text-white">Update</span>
            </el-button> 
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/store/receipts"
import { useAuthStore } from "@/store/users"
import { ref, reactive } from 'vue'
import type { FormProps, FormInstance, FormRules } from 'element-plus'
import type { User } from '@/types/types'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadFile } from 'element-plus'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'

const authStore = useAuthStore()
let imageUrl = ref()
const imageBlob = ref<File|string>('')
const uploadRef = ref<UploadFile>()
const store = useStore()
const labelPosition = ref<FormProps['labelPosition']>('top')
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const nuxtApp = useNuxtApp()

let user = reactive<User>({
  name: '',
  address: '',
  phone: '',
  imageUrl: ''
})

const passwordRules = reactive<FormRules<User>>({
  name: [
    { required: true, message: 'Please input company name', trigger: 'blur' },
  ],
})

onMounted(() => {
  store.fetchReceipts()
  fetchImage()
})

const uploadImg = () => {
  console.log(uploadRef.value)
  if (authStore.currentUser) {
    const userId = authStore.currentUser?.id
    if (imageBlob.value instanceof File) {
      const imageWithUserId = new File([imageBlob.value], userId, { type: imageBlob.value.type })
      nuxtApp.$saveFile(userId, imageWithUserId)
    } else {
      console.error("imageBlob.value is not a File object.")
    }
  } else {
    console.error("Current user not available.")
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  if (uploadFile.raw) {
    console.log(uploadFile.raw)
    imageBlob.value = uploadFile.raw
    imageUrl.value = URL.createObjectURL(uploadFile.raw)
    console.log(imageBlob.value, imageUrl.value)
  } else {
    console.error("Upload file raw is null")
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile)
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const fetchImage = async () => {
  try {
    if (authStore.currentUser) {
      const storageReference = storageRef(nuxtApp.$storage, `images/sph-logo.jpeg`)
      const url = await getDownloadURL(storageReference)
      imageUrl.value = url
    } else {
      console.error("Current user not available.")
    }
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

const update = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // await usersStore.updateProfile(user.name, user.address, user.phone, imageUrl.value)
      } catch (e) {
        console.log(e);
      } finally {
        loading.value = false;
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

::v-deep(.el-input__wrapper) {
  @apply py-[0.5em] rounded-xl 
}

::v-deep(.el-button) {
  @apply bg-sky-600 text-white py-[1.5em] rounded-xl w-full mt-[1.5rem]
}

::v-deep(.el-button):hover {
  @apply bg-sky-500 text-white py-[1.5em] rounded-xl 
}
</style>