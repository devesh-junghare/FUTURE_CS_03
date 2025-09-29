# FUTURE_CS_03
# 🔐 Secure File Sharing System

A secure web-based portal that allows users to upload and download files with **AES encryption**, ensuring files are protected **at rest and in transit**.

---

## 🚀 Features

- 📂 File **Upload & Download** functionality  
- 🔑 **AES Encryption & Decryption** for file security  
- 🌐 Encrypted file storage (files saved securely)  
- 🛡️ Secure transmission over **HTTPS**  
- 🗝️ **Key management** for controlled access  
- 🖥️ REST API endpoints (tested with **Postman/cURL**)  

---

## 🛠️ Tech Stack

- **Frontend/Backend Framework:** Next.js (Node.js)  
- **Encryption:** Node.js `crypto` module (AES)  
- **Styling:** Tailwind CSS + Radix UI  
- **Version Control:** Git & GitHub  
- **Testing:** Postman / curl  

---

## 📂 Project Structure
secure-file-sharing-system/  
│── app/ or pages/ # Frontend & API routes  
│ └── api/ # Upload & Download endpoints  
│── utils/ or lib/ # AES encryption/decryption helpers  
│── uploads/ # Encrypted file storage (ignored in git)  
│── package.json # Dependencies & scripts  
│── README.md # Documentation  
│── .gitignore # Ignored files/folders  


---

## ⚙️ Installation & Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/devesh-junghare/FUTURE_CS_03.git
   cd secure-file-sharing-system
2. **Install Dependencies**
   ```bash
   npm install
3. **Run Development Server**
   ```bash
   npm run dev
   ```
   👉 App will be live at http://localhost:3000
   
4.**Build for Production**
```bash
npm run build
npm start

```
---

## 🔒 Security Overview  

- AES Encryption → Ensures files are stored securely at rest.  
- Decryption on Download → Files are decrypted only when requested by an authorized user.  
- Key Management → AES keys stored securely, never hardcoded in codebase.  
- Secure Transmission → HTTPS protects data in transit.  
- Threats Mitigated → Unauthorized access, data leaks, and man-in-the-middle attacks.  

---

## 📌 How to Use  

- Upload a file → System encrypts & stores securely.  
- Download a file → System decrypts & returns the original.  
- Test APIs → Use Postman or curl to verify secure request handling.  
