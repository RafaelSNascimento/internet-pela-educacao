import { CustomComponent } from '../interfaces/custom-component';

const Component = (config: CustomComponent) => (cls: CustomElementConstructor): void => {
  validateConfig(config);

  const template = document.createElement('template');
  if (config.style) {
    require(`pages/${config.style}`);
  }

  template.innerHTML += require(`pages/${config.templateUrl}`);

  cls.prototype.connectedCallback = function() {
    const clone = document.importNode(template.content, true);
    if (config.useShadow) {
      this.attachShadow({mode: 'open'}).appendChild(clone);
    } else {
      this.appendChild(clone);
    }

    if (this.componentWillMount) {
      this.componentWillMount();
    }

    if (this.componentDidMount) {
      this.componentDidMount();
    }
  };

  cls.prototype.disconnectedCallback = function() {
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }

    if (this.componentDidUnmount) {
      this.componentDidUnmount();
    }
  }
  window.customElements.define(config.selector, cls);
};

const validateConfig = (config: CustomComponent) => {
  if (config.selector.indexOf('-') < 1) {
    throw new Error('You need at least 1 dash in the custom element name!');
  }

  if (!config.templateUrl) {
    throw new Error('You need to pass a templateUrl in the custom element config!');
  }
};

export default Component;
