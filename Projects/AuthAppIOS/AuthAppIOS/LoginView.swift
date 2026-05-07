import SwiftUI

struct LoginView: View {
    @Binding var showLogin: Bool

    @State private var email = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 16) {
            Text("Login")
                .font(.title2)
                .fontWeight(.semibold)

            TextField("Email", text: $email)
                .textInputAutocapitalization(.never)
                .keyboardType(.emailAddress)
                .autocorrectionDisabled()
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

            SecureField("Password", text: $password)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)

            Button("Login") {
                print("Login tapped")
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)

            HStack {
                Text("Don't have an account?")
                Button("Sign Up") {
                    showLogin = false
                }
            }
            .font(.footnote)
        }
    }
}

#Preview {
    LoginView(showLogin: .constant(true))
}
