class SellerProfile {
  final String? id;
  final String? qualification;
  final String? experiance;
  final String? description;

  SellerProfile({
    this.id,
    this.qualification,
    this.experiance,
    this.description,
  });

  factory SellerProfile.fromJson(Map<String, dynamic> json) {
    return SellerProfile(
      id: json['id'],
      qualification: json['qualification'],
      experiance: json['experiance'],
      description: json['description'],
    );
  }
}
