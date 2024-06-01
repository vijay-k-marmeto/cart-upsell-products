class DrawerUpsellProduct extends VariantSelects {
    constructor() {
      super();
      this.variantDataScript = this.querySelector('[type="application/json"]');
  
      if (this.variantDataScript) {
        this.variantData = JSON.parse(this.variantDataScript.textContent);
        this.removeEventListener('change', this.onVariantChange);
        this.addEventListener('change', this.onUpsellVariantChange.bind(this));
      }
    }
    onUpsellVariantChange(event) {
      event.stopPropagation()
  
      this.updateOptions();
      this.updateMasterId();
      this.toggleAddButton(true, '', false);
      this.removeErrorMessage();
      this.updateVariantStatuses();
  
      if (!this.currentVariant) {
        this.toggleAddButton(true, '', true);
      } else {
        this.updateUpsellVariantInput();
        this.renderUpsellProductInfo();
        this.toggleUpsellAddButton(!this.currentVariant.available, false, false)
      }
    }
    updateUpsellVariantInput(){
      const productForms = document.querySelectorAll(
        `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`
      );
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
      });
    }
    toggleUpsellAddButton(disable = true, text, modifyClass = true) {
      const productForm = document.getElementById(`product-form-${this.dataset.section}`);
      if (!productForm) return;
      const addButton = productForm.querySelector('[name="add"]');
      const addButtonText = productForm.querySelector('[name="add"] > span');
      if (!addButton) return;
  
      if (disable) {
        addButton.setAttribute('disabled', 'disabled');
        if (text) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute('disabled');
      }
      if (!modifyClass) return;
    }
    renderUpsellProductInfo(){
      const requestedVariantId = this.currentVariant.id;
      // prevent unnecessary ui changes from abandoned selections
      if (this.currentVariant.id !== requestedVariantId) return;
      const currency = this.querySelector(".upsell-variant-price").textContent.split(" ")[0]
      const currentVariantPrice = `${currency} ${parseInt(this.currentVariant.price / 100).toLocaleString()}`
      const currentVariantComparePrice = `${currency} ${parseInt(this.currentVariant.compare_at_price / 100).toLocaleString()}`
      this.querySelector(".upsell-variant-price").innerText = currentVariantPrice
      this.querySelector(".compare-price").innerText = currentVariantComparePrice
    }
}

customElements.define("drawer-upsell-product", DrawerUpsellProduct)