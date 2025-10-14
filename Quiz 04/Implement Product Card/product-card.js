class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: "Poppins", sans-serif;
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          max-width: 280px;
          cursor: pointer;
        }

        :host(:hover) {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        ::slotted(img) {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-bottom: 1px solid #eee;
          display: block;
        }

        .info {
          padding: 1rem;
          flex-grow: 1;
          text-align: left;
        }

        .name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #111;
          margin-bottom: 0.3rem;
        }

        .price {
          color: #007bff;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.6rem;
        }

        ::slotted(p) {
          color: #444;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        button {
          background: linear-gradient(135deg, #007bff, #00c6ff);
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          margin: 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          align-self: center;
          width: calc(100% - 2rem);
        }

        button:hover {
          background: linear-gradient(135deg, #0056d6, #00aaff);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }
      </style>

      <div class="card">
        <slot name="image"></slot>
        <div class="info">
          <div class="name"></div>
          <div class="price"></div>
          <slot name="description"></slot>
        </div>
        <button>Buy Now</button>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["name", "price"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name") {
      this.shadowRoot.querySelector(".name").textContent = newValue;
    }
    if (name === "price") {
      this.shadowRoot.querySelector(".price").textContent = `$${newValue}`;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      const product = {
        name: this.getAttribute("name"),
        price: this.getAttribute("price")
      };
      this.dispatchEvent(
        new CustomEvent("purchase", {
          detail: product,
          bubbles: true,
          composed: true
        })
      );
    });
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click");
  }
}

customElements.define("product-card", ProductCard);
