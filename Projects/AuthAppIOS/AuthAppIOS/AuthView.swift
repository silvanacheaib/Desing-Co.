import SwiftUI

struct AuthView: View {
    @State private var showLogin = true

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Welcome")
                    .font(.largeTitle)
                    .fontWeight(.bold)

                Text("Create an account or log in to continue")
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                Picker("Auth Mode", selection: $showLogin) {
                    Text("Login").tag(true)
                    Text("Sign Up").tag(false)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                if showLogin {
                    LoginView(showLogin: $showLogin)
                } else {
                    SignUpView(showLogin: $showLogin)
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Auth App")
        }
    }
}
