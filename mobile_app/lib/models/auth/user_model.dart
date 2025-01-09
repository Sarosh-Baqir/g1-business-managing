import 'package:e_commerce/models/auth/address_model.dart';
import 'package:e_commerce/models/auth/role_model.dart';
import 'package:e_commerce/models/auth/seller_profile.dart';
import 'package:e_commerce/utils/api_constnsts.dart';

class UserModel {
  final String? id;
  final String? email;
  final String? phone;
  final String? password;
  final String? firstName;
  final String? lastName;
  final String? gender;
  final String? otp;
  final String? profilePicture;
  final String? cnic;
  final AddressModel? address;
  final String? bio;
  final bool? isAdmin;
  final bool? isVerified;
  final String? roleId;
  final bool? isComplete;
  final Roles? role;
  final SellerProfile? sellerProfile;

  UserModel({
    this.id,
    this.email,
    this.phone,
    this.password,
    this.firstName,
    this.lastName,
    this.gender,
    this.otp,
    this.profilePicture,
    this.cnic,
    this.address,
    this.bio,
    this.isAdmin,
    this.isVerified,
    this.roleId,
    this.isComplete,
    this.role,
    this.sellerProfile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      password: json['password'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      gender: json['gender'] ?? '',
      bio: json['bio'] ?? '',
      otp: json['otp'] ?? '',
      profilePicture: json['profile_picture'] != null
          ? "${Constants.baseUrl}${json['profile_picture']}"
          : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      cnic: json['cnic'] ?? '',
      address: json['address'] != null
          ? AddressModel.fromJson(json['address'])
          : AddressModel(
              streetNo: 0,
              city: '',
              state: '',
              postalCode: '',
              country: '',
              location: ''),
      isAdmin: json['is_admin'] ?? false,
      isVerified: json['is_verified'] ?? false,
      roleId: json['role_id'] ?? '',
      isComplete: json['is_complete'] ?? false,
      role: json['role'] != null
          ? Roles.fromJson(json['role'])
          : Roles(id: '', title: '', permissions: []),
    );
  }
  factory UserModel.fromJsonGetMyData(Map<String, dynamic> json) {
    // Check if 'data' is an object and not a list, as the response does not contain a list in 'data'
    final userJson = json['data']['users']; // Access 'users' directly
    final roleJson = json['data']['roles']; // Access 'roles' directly
    final sellerProfileJson =
        json['data']['sellerProfile']; // Access 'sellerProfile' directly

    if (userJson == null) {
      throw Exception("Invalid or empty user data in response");
    }

    return UserModel(
      id: userJson['id'] ?? '',
      email: userJson['email'] ?? '',
      phone: userJson['phone'] ?? '',
      password: userJson['password'] ?? '',
      firstName: userJson['first_name'] ?? '',
      lastName: userJson['last_name'] ?? '',
      gender: userJson['gender'] ?? '',
      otp: userJson['otp'] ?? '',
      profilePicture: userJson['profile_picture'] != null
          ? "${Constants.baseUrl}${userJson['profile_picture']}"
          : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg',
      cnic: userJson['cnic'] ?? '',
      address: userJson['address'] != null
          ? AddressModel.fromJson(userJson['address'])
          : AddressModel(
              streetNo: 0,
              city: '',
              state: '',
              postalCode: '',
              country: '',
              location: '',
            ),
      bio: userJson['bio'] ?? '',
      isAdmin: userJson['is_admin'] ?? false,
      isVerified: userJson['is_verified'] ?? false,
      roleId: userJson['role_id'] ?? '',
      isComplete: json['data']['is_complete'] ??
          false, // Adjusted to access from the correct place
      role: roleJson != null
          ? Roles.fromJson(roleJson)
          : Roles(id: '', title: '', permissions: []),
      sellerProfile: sellerProfileJson != null
          ? SellerProfile.fromJson(sellerProfileJson)
          : SellerProfile(
              id: "",
              qualification: "",
              experiance: "",
              description: ""), // Handle seller profile if it exists
    );
  }

  factory UserModel.fromJsonForLogin(Map<String, dynamic> json) {
    // Extract the `userData` object from the response
    final userData = json['data']['userData'] as Map<String, dynamic>?;

    if (userData == null) {
      throw Exception("Invalid or missing user data in response");
    }

    final userJson = userData['users'] as Map<String, dynamic>?;
    final roleJson = userData['roles'] as Map<String, dynamic>?;
    final sellerProfileJson =
        userData['sellerProfile'] as Map<String, dynamic>?;

    if (userJson == null) {
      throw Exception("Invalid or empty user data in response");
    }

    return UserModel(
      id: userJson['id'] ?? '',
      email: userJson['email'] ?? '',
      phone: userJson['phone'] ?? '',
      password: '', // Password is typically not returned in login response
      firstName: userJson['first_name'] ?? '',
      lastName: userJson['last_name'] ?? '',
      gender: userJson['gender'] ?? '',
      otp: '', // Not part of the response
      profilePicture: userJson['profile_picture'] != null
          ? "${Constants.baseUrl}${userJson['profile_picture']}"
          : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg',

      cnic: userJson['cnic'] ?? '',
      address: userJson['address'] != null
          ? AddressModel.fromJson(userJson['address'])
          : AddressModel(
              streetNo: 0,
              city: '',
              state: '',
              postalCode: '',
              country: '',
              location: ''),
      bio: userJson['bio'] ?? '',
      isAdmin: userJson['is_admin'] ?? false,
      isVerified: userJson['is_verified'] ?? false,
      roleId: '', // Not present in response; assuming empty
      isComplete: userJson['is_complete'] ?? false,
      role: roleJson != null
          ? Roles.fromJson(roleJson)
          : Roles(id: '', title: '', permissions: []),
      sellerProfile: sellerProfileJson != null
          ? SellerProfile.fromJson(sellerProfileJson)
          : SellerProfile(
              id: '',
              qualification: '',
              experiance: '',
              description: ''), // Handle seller profile
    );
  }
}
