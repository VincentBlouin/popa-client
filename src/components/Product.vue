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
          <v-text-field
            :label="$t('product:unitPrice')"
            v-model="product.unitPrice"
            :rules="[rules.required]"
            min="0"
            type="number"
            v-if="!isAdminOnly"
          />
          <v-text-field
            :label="$t('product:nbInStock')"
            v-model="product.nbInStock"
            min="0"
            type="number"
            v-if="!isAdminOnly"
          />
        </v-form>
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
  import i18n from '@/i18n'
  import Rules from '@/rules'
  import ProductService from '../service/ProductService'

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
        edit: 'Modify'
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
        edit: 'Modifier'
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
        rules: Rules
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
      }
    },
    mounted: function () {
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

<style scoped>

</style>
