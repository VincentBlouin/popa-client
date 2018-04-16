<template>
  <panel :title="title">
    <v-card>
      <v-card-text>
        <v-form name="subscriberForm" ref="subscriberForm">
          <v-checkbox
            :label="$t('product:isAvailable')"
            v-model="product.isAvailable"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:nameFr')"
            v-model="product.name.fr"
            :rules="[rules.required]"
          />
          <v-text-field
            :label="$t('product:nameEn')"
            v-model="product.name.en"
            :rules="[rules.required]"
          />
          <v-text-field
            :label="$t('product:unitPrice')"
            v-model="product.unitPrice"
            :rules="[rules.required]"
            min="0"
            type="number"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:formatFr')"
            v-model="product.format.fr"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:formatEn')"
            v-model="product.format.en"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:nbInStock')"
            v-model="product.nbInStock"
            min="0"
            type="number"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:descriptionFr')"
            v-model="product.description.fr"
            multi-line
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:descriptionEn')"
            v-model="product.description.en"
            multi-line
            v-if="!isAdminOnly"
          />
        </v-form>
        <v-card>
          <v-card-title class="headline text-xs-center">
            {{$t('product:imageTitle')}}
          </v-card-title>
          <v-card-text>
            <v-layout row wrap layout-align="center center">
              <v-flex xs12 sm3 md3 class="mr-4">
                <v-card>
                  <v-card-media
                    class="white--text"
                    height="200px"
                    v-if="product.image"
                    :src="ProductService.getImageUrl(product)"
                  />
                </v-card>
              </v-flex>
              <v-flex xs12 sm8 md8>
                <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                  <div class="dropbox">
                    <input type="file" :name="uploadFieldName" :disabled="isSaving"
                           @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                           accept="image/*" class="input-file">
                    <p v-if="isInitial">
                      {{$t('product:uploadInstruction')}}
                    </p>
                    <p v-if="isSaving">
                      {{$t('product:uploading')}}
                    </p>
                  </div>
                </form>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="create()" v-if="isCreate">
          {{$t('product:add')}}
        </v-btn>
        <v-btn color="primary" @click="edit()" v-if="!isCreate">
          {{$t('product:edit')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </panel>
</template>

<script>
  import Vue from 'vue'
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import ProductService from '../service/ProductService'

  const STATUS_INITIAL_UPLOAD = 0,
    STATUS_SAVING_UPLOAD = 1,
    STATUS_SUCCESS_UPLOAD = 2,
    STATUS_FAILED_UPLOAD = 3

  export default {
    name: 'Product',
    data () {
      i18n.i18next.addResources('en', 'product', {
        addTitle: 'Add product',
        editTitle: 'Edit product',
        nameFr: 'Name (French)',
        nameEn: 'Name (English)',
        formatFr: 'Format (French)',
        formatEn: 'Format (English)',
        descriptionFr: 'Description (French)',
        descriptionEn: 'Description (English)',
        unitPrice: 'Unit price',
        isAvailable: 'Is available',
        nbInStock: 'Nb in stock',
        date: 'Creation day',
        add: 'Add',
        edit: 'Modify',
        imageTitle: 'Image',
        uploading: 'Uploading',
        uploadInstruction: 'To change the product image, drag your file here or click here'
      })
      i18n.i18next.addResources('fr', 'product', {
        addTitle: 'Ajouter un produit',
        editTitle: 'Modifier un produit',
        nameFr: 'Nom (Français)',
        nameEn: 'Nom (Anglais)',
        formatFr: 'Format (Français)',
        formatEn: 'Format (Anglais)',
        descriptionFr: 'Description (Français)',
        descriptionEn: 'Description (Anglais)',
        unitPrice: 'Prix unitaire',
        isAvailable: 'Est disponible',
        nbInStock: 'Nb en stock',
        date: 'Jour de création',
        add: 'Ajouter',
        edit: 'Modifier',
        imageTitle: 'Image',
        uploading: 'Téléversement',
        uploadInstruction: 'Pour modifier l\'image du produit, traînez votre fichier ici ou cliquez ici'
      })
      return {
        product: {
          name: {
            fr: '',
            en: ''
          },
          format: {
            fr: '',
            en: ''
          },
          description: {
            fr: '',
            en: ''
          }
        },
        rules: Rules,
        uploadError: null,
        currentUploadStatus: null,
        uploadFieldName: 'photos',
        ProductService: ProductService
      }
    },
    methods: {
      create: function () {
        if (!this.$refs.subscriberForm.validate()) {
          return
        }
        ProductService.create(
          this.product
        ).then(function () {
          this.$router.push({
            path: '/products'
          })
        }.bind(this))
      },
      edit: function () {
        if (!this.$refs.subscriberForm.validate()) {
          return
        }
        ProductService.update(
          this.product
        ).then(function () {
          this.$router.push({
            path: '/products'
          })
        }.bind(this))
      },
      reset () {
        // reset form to initial state
        this.currentUploadStatus = STATUS_INITIAL_UPLOAD
        this.uploadError = null
      },
      save (formData) {
        // upload data to the server
        this.currentUploadStatus = STATUS_INITIAL_UPLOAD

        ProductService.uploadImage(formData).then(function (image) {
          setTimeout(function () {
            this.product.image = image.data
            this.currentUploadStatus = STATUS_INITIAL_UPLOAD
            Vue.set(this.product, this.product)
          }.bind(this), 1000)
        }.bind(this)).catch(function (err) {
          this.uploadError = err.response
          this.currentStcurrentUploadStatusatus = STATUS_INITIAL_UPLOAD
        }.bind(this))
      },
      filesChange (fieldName, fileList) {
        // handle file changes
        const formData = new FormData()

        if (!fileList.length) return

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name)
          })

        // save it
        this.save(formData)
      }
    },
    computed: {
      isCreate: function () {
        return this.product.id === undefined
      },
      isAdminOnly: function () {
        return !this.isCreate && this.product.type === 'adminOnly'
      },
      title: function () {
        return this.isCreate ? this.$t('product:addTitle') : this.$t('product:editTitle')
      },
      isInitial () {
        return this.currentUploadStatus === STATUS_INITIAL_UPLOAD
      },
      isSaving () {
        return this.currentUploadStatus === STATUS_SAVING_UPLOAD
      },
      isSuccess () {
        return this.currentUploadStatus === STATUS_SUCCESS_UPLOAD
      },
      isFailed () {
        return this.currentUploadStatus === STATUS_FAILED_UPLOAD
      }
    },
    mounted: function () {
      this.reset()
      this.product.id = this.$route.params.productId
      if (!this.product.id) {
        return
      }
      ProductService.getDetails(this.product).then(function (product) {
        this.product = product.data
      }.bind(this))
    }
  }
</script>

<style>
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
