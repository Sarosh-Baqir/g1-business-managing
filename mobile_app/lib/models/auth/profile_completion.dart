class ProfileCompletion {
  final int userCompletionPercentage;
  final int sellerCompletionPercentage;

  ProfileCompletion({
    required this.userCompletionPercentage,
    required this.sellerCompletionPercentage,
  });

  // Factory to parse JSON response
  factory ProfileCompletion.fromJson(Map<String, dynamic> json) {
    return ProfileCompletion(
      userCompletionPercentage: json['userCompletionPercentage'],
      sellerCompletionPercentage: json['sellerCompletionPercentage'],
    );
  }
}
